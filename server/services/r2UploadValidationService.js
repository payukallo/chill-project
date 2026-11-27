const db = require("../db");
const AppError = require("../utils/AppError");

const {
  getUploadedObject,
  readUploadBytes
} = require("./r2StorageService");

const {
  validateImage,
  MAX_IMAGE_BYTES
} = require("./imageValidationService");

const {
  validateVideo,
  MAX_VIDEO_BYTES
} = require("./videoValidationService");

const VALIDATION_VERSION = 1;

const rules = {
  image: {
    maxSize: MAX_IMAGE_BYTES,
    types: {
      jpg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      avif: "image/avif"
    }
  },
  video: {
    maxSize: MAX_VIDEO_BYTES,
    types: {
      mp4: "video/mp4",
      webm: "video/webm"
    }
  }
};

function validateObjectMetadata(kind, key, object) {
  const rule = Object.hasOwn(rules, kind)
    ? rules[kind]
    : null;

  const extension = key.split(".").pop();

  if (
    !rule ||
    !Object.hasOwn(rule.types, extension) ||
    object.ContentType !== rule.types[extension] ||
    !Number.isSafeInteger(object.ContentLength) ||
    object.ContentLength <= 0 ||
    object.ContentLength > rule.maxSize ||
    typeof object.ETag !== "string" ||
    !/^"[^"]+"$/.test(object.ETag)
  ) {
    throw new AppError(
      "Metadata file tidak valid",
      422
    );
  }
}

function sameObject(first, second) {
  return (
    first.ETag === second.ETag &&
    first.ContentLength === second.ContentLength &&
    first.ContentType === second.ContentType &&
    Number.isFinite(new Date(first.LastModified).getTime()) &&
    new Date(first.LastModified).getTime() ===
      new Date(second.LastModified).getTime()
  );
}

async function validateUploadedBinary(
  kind,
  key,
  object
) {
  validateObjectMetadata(kind, key, object);

  const deadline = Date.now() + 45000;

  async function readBytes(offset, length) {
    if (Date.now() >= deadline) {
      throw new Error("BINARY_VALIDATION_TIMEOUT");
    }

    const bytes = await readUploadBytes(
      kind,
      key,
      object,
      offset,
      length
    );

    if (Date.now() >= deadline) {
      throw new Error("BINARY_VALIDATION_TIMEOUT");
    }

    return bytes;
  }

  if (kind === "image") {
    const buffer = await readBytes(
      0,
      object.ContentLength
    );

    return validateImage(
      buffer,
      object.ContentType
    );
  }

  return validateVideo({
    size: object.ContentLength,
    contentType: object.ContentType,
    readBytes
  });
}

async function recordVerifiedUpload(
  kind,
  key,
  original
) {
  // Lazy import untuk menghindari circular dependency.
  const {
    acquireCleanupLock,
    getUploadReference
  } = require("./r2CleanupSafetyService");

  const reference = getUploadReference(kind, key);

  if (!reference || reference.key !== key) {
    throw new AppError(
      "Path upload tidak valid",
      400
    );
  }

  const { bucket } = reference;

  const connection = await db.getConnection();

  try {
    await connection.query("BEGIN PESSIMISTIC");

    await acquireCleanupLock(connection);

    const [candidates] = await connection.execute(`
      SELECT status
      FROM r2_cleanup_candidates
      WHERE bucket = ? AND object_key = ?
      FOR UPDATE
    `, [bucket, key]);

    if (
      ["deleting", "deleted"]
        .includes(candidates[0]?.status)
    ) {
      throw new AppError(
        "File tidak tersedia. Silakan upload ulang.",
        409
      );
    }

    const current = await getUploadedObject(
      kind,
      key
    );

    validateObjectMetadata(kind, key, current);

    if (!sameObject(original, current)) {
      throw new AppError(
        "File berubah selama proses verifikasi",
        409
      );
    }

    await connection.execute(`
      INSERT INTO r2_verified_uploads (
        bucket,
        object_key,
        object_etag,
        size_bytes,
        content_type,
        validation_version,
        verified_at
      )
      VALUES (?, ?, ?, ?, ?, ?, UTC_TIMESTAMP(3))
      ON DUPLICATE KEY UPDATE
        object_etag = VALUES(object_etag),
        size_bytes = VALUES(size_bytes),
        content_type = VALUES(content_type),
        validation_version = VALUES(validation_version),
        verified_at = UTC_TIMESTAMP(3)
    `, [
      bucket,
      key,
      current.ETag,
      current.ContentLength,
      current.ContentType,
      VALIDATION_VERSION
    ]);

    await connection.commit();

  } catch (error) {
    await connection.rollback();
    throw error;

  } finally {
    connection.release();
  }
}

async function assertVerifiedUpload(
  connection,
  reference,
  object
) {
  const { kind, bucket, key } = reference;

  validateObjectMetadata(kind, key, object);

  const [rows] = await connection.execute(`
    SELECT
      object_etag,
      size_bytes,
      content_type,
      validation_version
    FROM r2_verified_uploads
    WHERE bucket = ? AND object_key = ?
    FOR UPDATE
  `, [bucket, key]);

  const verified = rows[0];

  if (
    !verified ||
    verified.object_etag !== object.ETag ||
    Number(verified.size_bytes) !== object.ContentLength ||
    verified.content_type !== object.ContentType ||
    Number(verified.validation_version) !==
      VALIDATION_VERSION
  ) {
    throw new AppError(
      "File belum lolos verifikasi binary. Silakan upload ulang.",
      409
    );
  }
}

module.exports = {
  validateObjectMetadata,
  validateUploadedBinary,
  recordVerifiedUpload,
  assertVerifiedUpload,
  sameObject,
  VALIDATION_VERSION
};
