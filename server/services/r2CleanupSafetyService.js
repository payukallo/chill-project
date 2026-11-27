const {
  normalizeObjectKey,
  getUploadedObject
} = require("./r2StorageService");

const AppError = require("../utils/AppError");

const {
  assertVerifiedUpload
} = require("./r2UploadValidationService");


async function acquireCleanupLock(connection) {
  const [rows] = await connection.execute(`
    SELECT id
    FROM r2_cleanup_lock
    WHERE id = 1
    FOR UPDATE
  `);

  if (rows.length !== 1) {
    throw new Error("R2_CLEANUP_LOCK_MISSING");
  }
}

function getUploadReference(kind, value) {
  if (value == null || value === "") return null;

  const key = normalizeObjectKey(value);

  if (!key.startsWith("images/uploads/")) {
    return null;
  }

  const imagePattern =
    /^images\/uploads\/image\/[0-9a-f-]{36}\.(jpg|png|webp|avif)$/;

  const videoPattern =
    /^images\/uploads\/video\/[0-9a-f-]{36}\.(mp4|webm)$/;

  const pattern =
    kind === "image" ? imagePattern : videoPattern;

  if (!pattern.test(key)) {
    throw new AppError("Path upload tidak valid", 400);
  }

  const bucket = kind === "image"
    ? process.env.R2_IMAGES_BUCKET
    : process.env.R2_VIDEOS_BUCKET;

  if (!bucket) {
    throw new Error("R2_BUCKET_NOT_CONFIGURED");
  }

  return { kind, bucket, key };
}

function collectUploadReferences(data, isSeries) {
  const references = new Map();

  function add(kind, value) {
    const reference = getUploadReference(kind, value);

    if (reference) {
      references.set(
        reference.bucket + ":" + reference.key,
        reference
      );
    }
  }

  add("image", data.cover_url);
  add("image", data.banner_url);

  if (!isSeries) {
    add("video", data.video_url);
  }

  if (isSeries && Array.isArray(data.episodes)) {
    for (const episode of data.episodes) {
      add(
        "image",
        episode.thumbnail ?? episode.cover_url
      );

      add("video", episode.video_url);
    }
  }

  return [...references.values()];
}

async function protectCatalogUploads(
  connection,
  data,
  isSeries = false
) {
  const references =
    collectUploadReferences(data, isSeries);

  for (const reference of references) {
    const { kind, bucket, key } = reference;

    const [rows] = await connection.execute(`
      SELECT status
      FROM r2_cleanup_candidates
      WHERE bucket = ? AND object_key = ?
      FOR UPDATE
    `, [bucket, key]);

    const status = rows[0]?.status;

    if (status === "deleting" || status === "deleted") {
      throw new AppError(
        "File tidak tersedia. Silakan upload ulang.",
        409
      );
    }

    try {
      const object = await getUploadedObject(kind, key);

      await assertVerifiedUpload(
        connection,
        reference,
        object
      );
    } catch (error) {
      if (error.$metadata?.httpStatusCode === 404) {
        throw new AppError(
          "File tidak ditemukan di R2",
          409
        );
      }

      throw error;
    }

    await connection.execute(`
      UPDATE r2_cleanup_candidates
      SET status = 'protected',
          last_seen_at = UTC_TIMESTAMP(3)
      WHERE bucket = ? AND object_key = ?
    `, [bucket, key]);
  }
}

module.exports = {
  acquireCleanupLock,
  getUploadReference,
  collectUploadReferences,
  protectCatalogUploads
};
