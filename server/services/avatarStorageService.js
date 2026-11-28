const { randomUUID } = require("node:crypto");
const sharp = require("sharp");

const AppError = require("../utils/AppError");
const userModel = require("../models/userModel");
const r2Storage = require("./r2StorageService");

const {
  validateImage,
  MAX_IMAGE_PIXELS
} = require("./imageValidationService");

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const AVATAR_SIZE = 512;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
]);

async function processAvatar(buffer, contentType) {
  if (
    !Buffer.isBuffer(buffer) ||
    buffer.length === 0
  ) {
    throw new AppError("File gambar tidak valid.", 400);
  }

  if (buffer.length > MAX_AVATAR_BYTES) {
    throw new AppError(
      "Ukuran foto maksimal 2MB.",
      413
    );
  }

  if (!ALLOWED_TYPES.has(contentType)) {
    throw new AppError(
      "Format foto tidak didukung.",
      400
    );
  }

  // Validasi signature, MIME, metadata dan pixel data.
  await validateImage(buffer, contentType);

  try {
    const processed = await sharp(buffer, {
      failOn: "warning",
      limitInputPixels: MAX_IMAGE_PIXELS
    })
      .rotate()
      .resize(AVATAR_SIZE, AVATAR_SIZE, {
        fit: "cover",
        position: "centre",
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .timeout({ seconds: 15 })
      .toBuffer();

    if (
      processed.length === 0 ||
      processed.length > MAX_AVATAR_BYTES
    ) {
      throw new Error("INVALID_AVATAR_OUTPUT");
    }

    return processed;
  } catch {
    throw new AppError(
      "Foto profil gagal diproses.",
      422
    );
  }
}

function createAvatarKey(userId) {
  const id = Number(userId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new AppError(
      "Identitas pengguna tidak valid.",
      400
    );
  }

  return `images/avatars/${id}/${randomUUID()}.webp`;
}


function getOwnedAvatarKey(userId, avatarUrl) {
  const id = Number(userId);

  if (
    !Number.isSafeInteger(id) ||
    id <= 0 ||
    typeof avatarUrl !== "string"
  ) {
    return null;
  }

  let base;

  try {
    base = r2Storage.getPublicImageBaseUrl();
  } catch {
    return null;
  }

  const prefix = base + "/";

  if (!avatarUrl.startsWith(prefix)) {
    return null;
  }

  const key = avatarUrl.slice(prefix.length);

  const pattern =
    /^images\/avatars\/([1-9]\d*)\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.webp$/;

  const match = pattern.exec(key);

  if (!match || match[1] !== String(id)) {
    return null;
  }

  if (r2Storage.getPublicImageUrl(key) !== avatarUrl) {
    return null;
  }

  return key;
}

async function cleanupAvatar(userId, avatarUrl) {
  try {
    const key = getOwnedAvatarKey(userId, avatarUrl);

    if (!key) {
      return false;
    }

    if (
      await userModel.isAvatarUrlReferenced(avatarUrl)
    ) {
      return false;
    }

    await r2Storage.deleteAvatarObject(userId, key);

    return true;
  } catch (error) {
    // Jangan membocorkan URL, key atau credential.
    console.error(
      "Avatar cleanup failed:",
      error.code || error.name || "UNKNOWN_ERROR"
    );

    return false;
  }
}

async function replaceAvatar(
  userId,
  buffer,
  contentType
) {
  const key = createAvatarKey(userId);

  const user = await userModel.findUserById(userId);

  if (!user) {
    throw new AppError(
      "Pengguna tidak ditemukan.",
      404
    );
  }

  const previousUrl = user.avatar_url ?? null;

  const processed = await processAvatar(
    buffer,
    contentType
  );

  const newUrl = await r2Storage.putAvatarObject(
    userId,
    key,
    processed
  );

  const updated =
    await userModel.compareAndSwapAvatarUrl(
      userId,
      previousUrl,
      newUrl
    );

  if (!updated) {
    // CAS secara pasti tidak berhasil.
    // Hapus objek baru hanya jika tidak direferensikan.
    await cleanupAvatar(userId, newUrl);

    throw new AppError(
      "Foto profil berubah pada request lain. Silakan coba lagi.",
      409
    );
  }

  // Database sudah menunjuk ke avatar baru.
  // Avatar Supabase dan objek di luar prefix aman.
  await cleanupAvatar(userId, previousUrl);

  return newUrl;
}

module.exports = {
  MAX_AVATAR_BYTES,
  AVATAR_SIZE,
  processAvatar,
  createAvatarKey,
  replaceAvatar,
  getOwnedAvatarKey,
  cleanupAvatar
};
