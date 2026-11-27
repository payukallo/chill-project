const db = require("../db");

const {
  getUploadedObject,
  deleteUploadObject
} = require("./r2StorageService");

const {
  acquireCleanupLock,
  getUploadReference
} = require("./r2CleanupSafetyService");

const {
  readReferences
} = require("./r2CleanupService");

const MAX_BATCH = 10;

async function transaction(callback) {
  const connection = await db.getConnection();

  try {
    await connection.query("BEGIN PESSIMISTIC");
    await acquireCleanupLock(connection);

    const result = await callback(connection);

    await connection.commit();

    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

function validateTarget(row) {
  let kind;

  if (
    row.bucket === process.env.R2_IMAGES_BUCKET
  ) {
    kind = "image";
  } else if (
    row.bucket === process.env.R2_VIDEOS_BUCKET
  ) {
    kind = "video";
  } else {
    throw new Error("UNSAFE_DELETE_BUCKET");
  }

  const reference = getUploadReference(
    kind,
    row.object_key
  );

  if (
    !reference ||
    reference.bucket !== row.bucket ||
    reference.key !== row.object_key
  ) {
    throw new Error("UNSAFE_DELETE_TARGET");
  }

  return kind;
}

async function headObject(kind, key) {
  try {
    return await getUploadedObject(kind, key);
  } catch (error) {
    if (error.$metadata?.httpStatusCode === 404) {
      return null;
    }

    throw error;
  }
}

async function prepareDeletion(target) {
  return transaction(async connection => {
    const [rows] = await connection.execute(`
      SELECT *,
        TIMESTAMPDIFF(
          SECOND,
          first_seen_at,
          UTC_TIMESTAMP(3)
        ) AS age_seconds
      FROM r2_cleanup_candidates
      WHERE bucket = ? AND object_key = ?
      FOR UPDATE
    `, [target.bucket, target.object_key]);

    const row = rows[0];

    if (!row) return null;

    if (
      row.status !== "deleting" &&
      (
        row.status !== "pending" ||
        Number(row.age_seconds) < 604800
      )
    ) {
      return null;
    }

    const kind = validateTarget(row);

    const references =
      await readReferences(connection);

    const id = JSON.stringify([
      row.bucket,
      row.object_key
    ]);

    if (references.has(id)) {
      if (row.status === "deleting") {
        throw new Error("DELETING_OBJECT_REFERENCED");
      }

      await connection.execute(`
        UPDATE r2_cleanup_candidates
        SET status = 'protected'
        WHERE bucket = ? AND object_key = ?
      `, [row.bucket, row.object_key]);

      return null;
    }

    const object = await headObject(
      kind,
      row.object_key
    );

    if (
      object &&
      (
        object.ETag !== row.object_etag ||
        Number(object.ContentLength) !==
          Number(row.size_bytes) ||
        !object.LastModified ||
        Date.now() -
          new Date(object.LastModified).getTime()
          < 604800000
      )
    ) {
      if (row.status === "deleting") {
        throw new Error("DELETING_OBJECT_CHANGED");
      }

      await connection.execute(`
        UPDATE r2_cleanup_candidates
        SET status = 'protected'
        WHERE bucket = ? AND object_key = ?
      `, [row.bucket, row.object_key]);

      return null;
    }

    await connection.execute(`
      UPDATE r2_cleanup_candidates
      SET status = 'deleting'
      WHERE bucket = ? AND object_key = ?
    `, [row.bucket, row.object_key]);

    return {
      ...row,
      kind
    };
  });
}

async function finishDeletion(target) {
  return transaction(async connection => {
    const [rows] = await connection.execute(`
      SELECT *
      FROM r2_cleanup_candidates
      WHERE bucket = ? AND object_key = ?
      FOR UPDATE
    `, [target.bucket, target.object_key]);

    const row = rows[0];

    if (!row || row.status !== "deleting") {
      return false;
    }

    const kind = validateTarget(row);

    const references =
      await readReferences(connection);

    if (
      references.has(JSON.stringify([
        row.bucket,
        row.object_key
      ]))
    ) {
      throw new Error("DELETE_REFERENCE_CONFLICT");
    }

    const object = await headObject(
      kind,
      row.object_key
    );

    if (object) {
      if (
        object.ETag !== row.object_etag ||
        Number(object.ContentLength) !==
          Number(row.size_bytes) ||
        !object.LastModified ||
        Date.now() -
          new Date(object.LastModified).getTime()
          < 604800000
      ) {
        throw new Error("DELETE_METADATA_CONFLICT");
      }

      await deleteUploadObject(
        kind,
        row.object_key
      );
    }

    const remaining = await headObject(
      kind,
      row.object_key
    );

    if (remaining) {
      throw new Error("R2_DELETE_NOT_CONFIRMED");
    }

    await connection.execute(`
      UPDATE r2_cleanup_candidates
      SET status = 'deleted',
          deleted_at = UTC_TIMESTAMP(3),
          last_seen_at = UTC_TIMESTAMP(3)
      WHERE bucket = ? AND object_key = ?
    `, [row.bucket, row.object_key]);

    return true;
  });
}

async function deleteEligibleObjects({
  dryRun = true
} = {}) {
  if (typeof dryRun !== "boolean") {
    throw new Error("INVALID_DELETE_MODE");
  }

  if (
    !dryRun &&
    process.env.R2_CLEANUP_DELETE_ENABLED !== "true"
  ) {
    throw new Error("AUTOMATIC_DELETE_DISABLED");
  }

  const [targets] = await db.execute(`
    SELECT bucket, object_key, status
    FROM r2_cleanup_candidates
    WHERE status = 'deleting'
       OR (
         status = 'pending'
         AND first_seen_at <=
             UTC_TIMESTAMP(3) - INTERVAL 7 DAY
       )
    ORDER BY
      status = 'deleting' DESC,
      first_seen_at ASC
    LIMIT ${MAX_BATCH}
  `);

  const report = {
    mode: dryRun ? "dry-run" : "delete",
    selected: targets.length,
    deleted: 0,
    skipped: 0
  };

  if (dryRun) return report;

  for (const target of targets) {
    const prepared =
      await prepareDeletion(target);

    if (!prepared) {
      report.skipped++;
      continue;
    }

    const deleted =
      await finishDeletion(prepared);

    if (deleted) {
      report.deleted++;
    } else {
      report.skipped++;
    }
  }

  return report;
}

module.exports = {
  deleteEligibleObjects
};
