const path = require("node:path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
  quiet: true
});

const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand
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

function getPublicImageBaseUrl() {
  const raw = process.env.R2_IMAGES_PUBLIC_URL;

  if (!raw || !raw.trim()) {
    throw new Error("R2_IMAGE_URL_NOT_CONFIGURED");
  }

  const value = raw.trim();

  // Hanya HTTPS origin, dengan optional trailing slash.
  if (!/^https:\/\/[a-zA-Z0-9.-]+\/?$/.test(value)) {
    throw new Error("INVALID_R2_IMAGE_PUBLIC_URL");
  }

  let parsed;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error("INVALID_R2_IMAGE_PUBLIC_URL");
  }

  const hostname = parsed.hostname;

  const validHostname =
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i
      .test(hostname);

  if (
    parsed.protocol !== "https:" ||
    !validHostname ||
    hostname === "r2.cloudflarestorage.com" ||
    hostname.endsWith(".r2.cloudflarestorage.com") ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    parsed.username ||
    parsed.password ||
    parsed.port ||
    parsed.search ||
    parsed.hash ||
    parsed.pathname !== "/"
  ) {
    throw new Error("INVALID_R2_IMAGE_PUBLIC_URL");
  }

  return parsed.origin;
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

  const base = getPublicImageBaseUrl();

  return base + "/" +
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


const UPLOAD_URL_TTL_SECONDS = 900;

function getUploadBucket(kind) {
  if (kind === "image") {
    return process.env.R2_IMAGES_BUCKET;
  }

  if (kind === "video") {
    return process.env.R2_VIDEOS_BUCKET;
  }

  throw new Error("INVALID_UPLOAD_KIND");
}

async function createSignedUploadUrl({
  kind,
  key,
  contentType,
  size
}) {
  if (kind === "image") {
    getPublicImageBaseUrl();
  }

  const s3 = getClient();

  return getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: getUploadBucket(kind),
      Key: normalizeObjectKey(key),
      ContentType: contentType,
      ContentLength: size,
      IfNoneMatch: "*"
    }),
    {
      expiresIn: UPLOAD_URL_TTL_SECONDS,
      signableHeaders: new Set([
        "content-type",
        "content-length",
        "if-none-match"
      ])
    }
  );
}

async function getUploadedObject(kind, key) {
  const s3 = getClient();

  return s3.send(
    new HeadObjectCommand({
      Bucket: getUploadBucket(kind),
      Key: normalizeObjectKey(key)
    })
  );
}

async function listUploadObjects(kind) {
  const bucket = getUploadBucket(kind);
  const prefix = `images/uploads/${kind}/`;
  const objects = [];
  const tokens = new Set();

  if (!bucket) {
    throw new Error("R2_BUCKET_NOT_CONFIGURED");
  }

  let token;

  do {
    const page = await getClient().send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        MaxKeys: 1000,
        ContinuationToken: token
      })
    );

    for (const object of page.Contents ?? []) {
      if (!object.Key?.startsWith(prefix)) {
        throw new Error("INVALID_R2_LIST_RESPONSE");
      }

      objects.push({
        bucket,
        kind,
        key: object.Key,
        etag: object.ETag,
        size: object.Size,
        lastModified: object.LastModified
      });
    }

    if (!page.IsTruncated) break;

    token = page.NextContinuationToken;

    if (!token || tokens.has(token)) {
      throw new Error("INVALID_R2_PAGINATION");
    }

    tokens.add(token);

  } while (token);

  return objects;
}

async function deleteUploadObject(kind, key) {
  const patterns = {
    image: /^images\/uploads\/image\/[0-9a-f-]{36}\.(jpg|png|webp|avif)$/,
    video: /^images\/uploads\/video\/[0-9a-f-]{36}\.(mp4|webm)$/
  };

  if (
    !Object.hasOwn(patterns, kind) ||
    normalizeObjectKey(key) !== key ||
    !patterns[kind].test(key)
  ) {
    throw new Error("UNSAFE_DELETE_SCOPE");
  }

  const bucket = getUploadBucket(kind);

  if (!bucket) {
    throw new Error("R2_BUCKET_NOT_CONFIGURED");
  }

  await getClient().send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key
    })
  );
}


async function readUploadBytes(
  kind,
  key,
  object,
  start,
  length
) {
  const total = object.ContentLength;
  const maxRead = 10 * 1024 * 1024;

  if (
    !Number.isSafeInteger(total) ||
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(length) ||
    start < 0 ||
    length <= 0 ||
    length > maxRead ||
    start + length > total ||
    typeof object.ETag !== "string" ||
    !/^"[^"]+"$/.test(object.ETag)
  ) {
    throw new Error("INVALID_BINARY_READ");
  }

  const end = start + length - 1;
  const expectedRange =
    `bytes ${start}-${end}/${total}`;

  const result = await getClient().send(
    new GetObjectCommand({
      Bucket: getUploadBucket(kind),
      Key: normalizeObjectKey(key),
      Range: `bytes=${start}-${end}`,
      IfMatch: object.ETag
    }),
    {
      abortSignal: AbortSignal.timeout(20000)
    }
  );

  try {
    if (
      !result.Body ||
      result.$metadata?.httpStatusCode !== 206 ||
      result.ContentRange !== expectedRange ||
      result.ContentLength !== length ||
      result.ETag !== object.ETag ||
      result.ContentType !== object.ContentType
    ) {
      throw new Error("INVALID_BINARY_RESPONSE");
    }

    const chunks = [];
    let received = 0;

    for await (const chunk of result.Body) {
      received += chunk.length;

      if (received > length) {
        throw new Error("BINARY_READ_LIMIT_EXCEEDED");
      }

      chunks.push(Buffer.from(chunk));
    }

    if (received !== length) {
      throw new Error("INCOMPLETE_BINARY_READ");
    }

    return Buffer.concat(chunks, received);
  } finally {
    result.Body?.destroy?.();
  }
}


async function putAvatarObject(userId, key, buffer) {
  const id = Number(userId);

  const pattern =
    /^images\/avatars\/([1-9]\d*)\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.webp$/;

  const match = typeof key === "string"
    ? pattern.exec(key)
    : null;

  if (
    !Number.isSafeInteger(id) ||
    id <= 0 ||
    !match ||
    match[1] !== String(id) ||
    normalizeObjectKey(key) !== key ||
    !Buffer.isBuffer(buffer) ||
    buffer.length === 0 ||
    buffer.length > 2 * 1024 * 1024
  ) {
    throw new Error("INVALID_AVATAR_UPLOAD");
  }

  const publicUrl = getPublicImageUrl(key);

  const s3 = getClient();

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.R2_IMAGES_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "image/webp",
      ContentLength: buffer.length,
      CacheControl: "public, max-age=86400",
      IfNoneMatch: "*"
    }),
    {
      abortSignal: AbortSignal.timeout(20000)
    }
  );

  return publicUrl;
}


async function deleteAvatarObject(userId, key) {
  const id = Number(userId);

  const pattern =
    /^images\/avatars\/([1-9]\d*)\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.webp$/;

  const match = typeof key === "string"
    ? pattern.exec(key)
    : null;

  if (
    !Number.isSafeInteger(id) ||
    id <= 0 ||
    !match ||
    match[1] !== String(id) ||
    normalizeObjectKey(key) !== key
  ) {
    throw new Error("UNSAFE_AVATAR_DELETE_SCOPE");
  }

  await getClient().send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_IMAGES_BUCKET,
      Key: key
    }),
    {
      abortSignal: AbortSignal.timeout(10000)
    }
  );
}

module.exports = {
  deleteAvatarObject,
  putAvatarObject,
  readUploadBytes,
  deleteUploadObject,
  listUploadObjects,
  createSignedUploadUrl,
  getUploadedObject,
  UPLOAD_URL_TTL_SECONDS,

  normalizeObjectKey,
  getPublicImageBaseUrl,
  getPublicImageUrl,
  getSignedVideoUrl,
  VIDEO_URL_TTL_SECONDS
};
