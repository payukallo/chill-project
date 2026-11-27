const { randomUUID } = require("node:crypto");
const jwt = require("jsonwebtoken");

const {
  createSignedUploadUrl,
  getUploadedObject,
  UPLOAD_URL_TTL_SECONDS
} = require("../services/r2StorageService");

const AppError = require("../utils/AppError");

const {
  validateUploadedBinary,
  recordVerifiedUpload
} = require("../services/r2UploadValidationService");

const MiB = 1024 * 1024;

const rules = {
  image: {
    maxSize: 10 * MiB,
    types: {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/avif": "avif"
    }
  },
  video: {
    maxSize: 500 * MiB,
    types: {
      "video/mp4": "mp4",
      "video/webm": "webm"
    }
  }
};

function getRule(kind) {
  return Object.hasOwn(rules, kind)
    ? rules[kind]
    : null;
}

function fail(res, status, message) {
  return res.status(status).json({
    status: "error",
    message
  });
}

function uploadSecret() {
  return require("node:crypto")
    .createHmac("sha256", process.env.JWT_SECRET)
    .update("chill-r2-upload-ticket-v1")
    .digest();
}

async function presignUpload(req, res) {
  res.set("Cache-Control", "private, no-store");

  const { kind, contentType, size } = req.body ?? {};

  const rule = getRule(kind);

  if (!rule) {
    return fail(res, 400, "Jenis media tidak valid");
  }

  if (
    typeof contentType !== "string" ||
    !Object.hasOwn(rule.types, contentType)
  ) {
    return fail(res, 400, "Format media tidak didukung");
  }

  if (!Number.isSafeInteger(size) || size <= 0) {
    return fail(res, 400, "Ukuran file tidak valid");
  }

  if (size > rule.maxSize) {
    return fail(res, 413, "Ukuran file melebihi batas");
  }

  const extension = rule.types[contentType];

  const key =
    `images/uploads/${kind}/${randomUUID()}.${extension}`;

  try {
    const uploadUrl = await createSignedUploadUrl({
      kind,
      key,
      contentType,
      size
    });

    const signedHeaders = new Set(
      (
        new URL(uploadUrl)
          .searchParams.get("X-Amz-SignedHeaders") || ""
      ).split(";")
    );

    for (const header of [
      "content-type",
      "content-length",
      "if-none-match"
    ]) {
      if (!signedHeaders.has(header)) {
        throw new Error("REQUIRED_HEADER_NOT_SIGNED");
      }
    }

    const uploadToken = jwt.sign(
      {
        purpose: "r2-upload",
        userId: req.user.id,
        kind,
        key,
        contentType,
        size
      },
      uploadSecret(),
      {
        algorithm: "HS256",
        expiresIn: UPLOAD_URL_TTL_SECONDS + 1800
      }
    );

    return res.status(200).json({
      status: "success",
      data: {
        key,
        uploadUrl,
        uploadToken,
        expiresIn: UPLOAD_URL_TTL_SECONDS,
        headers: {
          "Content-Type": contentType,
          "If-None-Match": "*"
        }
      }
    });
  } catch (error) {
    console.error(
      "Presign upload failed:",
      error.name
    );

    return fail(res, 500, "Gagal menyiapkan upload");
  }
}

async function completeUpload(req, res) {
  res.set("Cache-Control", "private, no-store");

  const { uploadToken } = req.body ?? {};

  if (typeof uploadToken !== "string") {
    return fail(res, 400, "Upload token diperlukan");
  }

  let ticket;

  try {
    ticket = jwt.verify(
      uploadToken,
      uploadSecret(),
      { algorithms: ["HS256"] }
    );
  } catch {
    return fail(res, 400, "Upload token tidak valid");
  }

  if (
    ticket.purpose !== "r2-upload" ||
    ticket.userId !== req.user.id
  ) {
    return fail(res, 403, "Upload tidak diizinkan");
  }

  try {
    const object = await getUploadedObject(
      ticket.kind,
      ticket.key
    );

    if (
      object.ContentLength !== ticket.size ||
      object.ContentType !== ticket.contentType
    ) {
      return fail(
        res,
        422,
        "Metadata file tidak sesuai"
      );
    }

    await validateUploadedBinary(
      ticket.kind,
      ticket.key,
      object
    );

    await recordVerifiedUpload(
      ticket.kind,
      ticket.key,
      object
    );

    return res.status(200).json({
      status: "success",
      message: "Upload berhasil diverifikasi",
      data: {
        key: ticket.key,
        size: object.ContentLength,
        contentType: object.ContentType
      }
    });
  } catch (error) {
    if (error.$metadata?.httpStatusCode === 404) {
      return fail(res, 404, "File belum tersedia di R2");
    }

    if (error instanceof AppError) {
      const status = Number(
        error.statusCode ?? error.status
      );

      if ([400, 409, 422].includes(status)) {
        return fail(res, status, error.message);
      }
    }

    if (error.$metadata?.httpStatusCode === 412) {
      return fail(res, 409, "File berubah selama verifikasi");
    }

    console.error(
      "Upload verification failed:",
      error.name
    );

    return fail(res, 500, "Gagal memverifikasi upload");
  }
}

module.exports = {
  presignUpload,
  completeUpload
};
