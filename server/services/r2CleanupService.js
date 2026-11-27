const db = require("../db");

const {
  listUploadObjects
} = require("./r2StorageService");

const {
  acquireCleanupLock,
  getUploadReference
} = require("./r2CleanupSafetyService");

const GRACE_DAYS = 7;
const GRACE_MS = GRACE_DAYS * 86400000;

function objectId(bucket, key) {
  return JSON.stringify([bucket, key]);
}

async function readReferences(connection) {
  const references = new Set();

  function add(kind, value) {
    const reference = getUploadReference(kind, value);

    if (reference) {
      references.add(
        objectId(reference.bucket, reference.key)
      );
    }
  }

  const [media] = await connection.execute(`
    SELECT cover_url, banner_url
    FROM media_new
    FOR UPDATE
  `);

  for (const row of media) {
    add("image", row.cover_url);
    add("image", row.banner_url);
  }

  const [movies] = await connection.execute(`
    SELECT video_url
    FROM movies_new
    FOR UPDATE
  `);

  for (const row of movies) {
    add("video", row.video_url);
  }

  const [episodes] = await connection.execute(`
    SELECT cover_url, video_url
    FROM episodes_new
    FOR UPDATE
  `);

  for (const row of episodes) {
    add("image", row.cover_url);
    add("video", row.video_url);
  }

  return references;
}

async function scanOrphans({ dryRun = true } = {}) {
  if (typeof dryRun !== "boolean") {
    throw new Error("INVALID_SCAN_MODE");
  }

  const [images, videos] = await Promise.all([
    listUploadObjects("image"),
    listUploadObjects("video")
  ]);

  const objects = [...images, ...videos];
  const inventory = new Set();

  const report = {
    mode: dryRun ? "dry-run" : "observe",
    scanned: objects.length,
    protected: 0,
    ignored: 0,
    newCandidates: 0,
    waiting: 0,
    eligible: 0,
    missing: 0,
    eligibleBytes: 0,
    deleted: 0
  };

  const connection = await db.getConnection();

  try {
    await connection.query("BEGIN PESSIMISTIC");
    await acquireCleanupLock(connection);

    const references = await readReferences(connection);

    const [rows] = await connection.execute(`
      SELECT
        bucket,
        object_key,
        object_etag,
        size_bytes,
        status,
        TIMESTAMPDIFF(
          SECOND,
          first_seen_at,
          UTC_TIMESTAMP(3)
        ) AS age_seconds
      FROM r2_cleanup_candidates
      FOR UPDATE
    `);

    const candidates = new Map(
      rows.map(row => [
        objectId(row.bucket, row.object_key),
        row
      ])
    );

    for (const object of objects) {
      const { kind, bucket, key, etag, size } = object;
      const id = objectId(bucket, key);

      if (inventory.has(id)) {
        throw new Error("DUPLICATE_R2_OBJECT");
      }

      inventory.add(id);

      let reference;

      try {
        reference = getUploadReference(kind, key);
      } catch {
        report.ignored++;
        continue;
      }

      if (!reference || reference.bucket !== bucket) {
        report.ignored++;
        continue;
      }

      if (
        typeof etag !== "string" ||
        !etag ||
        !Number.isSafeInteger(size) ||
        size < 0
      ) {
        throw new Error("INVALID_R2_OBJECT_METADATA");
      }

      const previous = candidates.get(id);

      // Jangan mengubah status operasi penghapusan.
      if (
        previous?.status === "deleting" ||
        previous?.status === "deleted"
      ) {
        report.ignored++;
        continue;
      }

      if (references.has(id)) {
        report.protected++;

        if (!dryRun && previous) {
          await connection.execute(`
            UPDATE r2_cleanup_candidates
            SET status = 'protected',
                last_seen_at = UTC_TIMESTAMP(3)
            WHERE bucket = ? AND object_key = ?
          `, [bucket, key]);
        }

        continue;
      }

      const reset =
        !previous ||
        previous.status !== "pending" ||
        previous.object_etag !== etag ||
        Number(previous.size_bytes) !== size;

      if (reset) {
        report.newCandidates++;

        if (!dryRun) {
          await connection.execute(`
            INSERT INTO r2_cleanup_candidates (
              bucket,
              object_key,
              object_etag,
              size_bytes,
              first_seen_at,
              last_seen_at,
              status,
              deleted_at
            )
            VALUES (
              ?, ?, ?, ?,
              UTC_TIMESTAMP(3),
              UTC_TIMESTAMP(3),
              'pending',
              NULL
            )
            ON DUPLICATE KEY UPDATE
              object_etag = VALUES(object_etag),
              size_bytes = VALUES(size_bytes),
              first_seen_at = UTC_TIMESTAMP(3),
              last_seen_at = UTC_TIMESTAMP(3),
              status = 'pending',
              deleted_at = NULL
          `, [bucket, key, etag, size]);
        }

        continue;
      }

      const age = Number(previous.age_seconds) * 1000;

      if (age >= GRACE_MS) {
        report.eligible++;
        report.eligibleBytes += size;
      } else {
        report.waiting++;
      }

      if (!dryRun) {
        await connection.execute(`
          UPDATE r2_cleanup_candidates
          SET last_seen_at = UTC_TIMESTAMP(3)
          WHERE bucket = ? AND object_key = ?
        `, [bucket, key]);
      }
    }

    // Objek yang tidak lagi ditemukan harus
    // mengulang masa tenggang jika muncul kembali.
    for (const [id, row] of candidates) {
      if (
        inventory.has(id) ||
        row.status !== "pending"
      ) continue;

      report.missing++;

      if (!dryRun) {
        await connection.execute(`
          UPDATE r2_cleanup_candidates
          SET status = 'protected',
              last_seen_at = UTC_TIMESTAMP(3)
          WHERE bucket = ? AND object_key = ?
        `, [row.bucket, row.object_key]);
      }
    }

    if (dryRun) {
      await connection.rollback();
    } else {
      await connection.commit();
    }

    return report;

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  GRACE_DAYS,
  readReferences,
  scanOrphans
};
