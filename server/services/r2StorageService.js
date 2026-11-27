const path = require("node:path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
  quiet: true
});

const {
  S3Client,
  GetObjectCommand
} = require("@aws-sdk/client-s3");

const {
  getSignedUrl
} = require("@aws-sdk/s3-request-presigner");

const VIDEO_URL_TTL_SECONDS = 14400;

let client;

function getClient() {
  if (!client) {
    const required = [
      "R2_ENDPOINT",
      "R2_ACCESS_KEY_ID",
      "R2_SECRET_ACCESS_KEY",
      "R2_IMAGES_BUCKET",
      "R2_VIDEOS_BUCKET",
      "R2_IMAGES_PUBLIC_URL"
    ];

    for (const key of required) {
      if (!process.env[key]?.trim()) {
        throw new Error("Missing R2 configuration: " + key);
      }
    }

    client = new S3Client({
      region: process.env.R2_REGION || "auto",
      endpoint: process.env.R2_ENDPOINT,

      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
      },

      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
      maxAttempts: 2
    });
  }

  return client;
}

function normalizeObjectKey(value) {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw new Error("INVALID_MEDIA_PATH");
  }

  const raw = value.trim();

  if (
    /^[a-z][a-z0-9+.-]*:/i.test(raw) ||
    raw.startsWith("//") ||
    /[?#\\%\x00-\x1f\x7f]/.test(raw)
  ) {
    throw new Error("INVALID_MEDIA_PATH");
  }

  const key = raw.replace(/^\/+/, "");

  if (
    !key.startsWith("images/") ||
    key.split("/").some(
      part => !part ||
        part === "." ||
        part === ".."
    )
  ) {
    throw new Error("INVALID_MEDIA_PATH");
  }

  return key;
}

function getPublicImageUrl(value) {
  if (!value) return value;

  const key = normalizeObjectKey(value);

  if (
    !/\.(jpg|jpeg|png|webp|avif|svg|gif|ico)$/i
      .test(key)
  ) {
    throw new Error("INVALID_IMAGE_TYPE");
  }

  const base = process.env.R2_IMAGES_PUBLIC_URL;

  if (!base) {
    throw new Error("R2_IMAGE_URL_NOT_CONFIGURED");
  }

  return base.replace(/\/$/, "") + "/" +
    key.split("/").map(encodeURIComponent).join("/");
}

async function getSignedVideoUrl(value) {
  const key = normalizeObjectKey(value);

  if (!/\.(mp4|webm|mov|mkv)$/i.test(key)) {
    throw new Error("INVALID_VIDEO_TYPE");
  }

  const s3 = getClient();

  return getSignedUrl(
    s3,

    new GetObjectCommand({
      Bucket: process.env.R2_VIDEOS_BUCKET,
      Key: key
    }),

    {
      expiresIn: VIDEO_URL_TTL_SECONDS
    }
  );
}

module.exports = {
  normalizeObjectKey,
  getPublicImageUrl,
  getSignedVideoUrl,
  VIDEO_URL_TTL_SECONDS
};
