const sharp = require("sharp");
const AppError = require("../utils/AppError");

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 25_000_000;

function invalidImage() {
  return new AppError(
    "Isi file gambar tidak valid atau rusak",
    422
  );
}

function detectImageType(buffer) {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "image/jpeg";
  }

  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from("89504e470d0a1a0a", "hex")
    )
  ) {
    return "image/png";
  }

  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  if (
    buffer.length >= 16 &&
    buffer.toString("ascii", 4, 8) === "ftyp"
  ) {
    const boxSize = buffer.readUInt32BE(0);

    if (
      boxSize >= 16 &&
      boxSize <= buffer.length &&
      boxSize % 4 === 0
    ) {
      const brands = [
        buffer.toString("ascii", 8, 12)
      ];

      for (let i = 16; i < boxSize; i += 4) {
        brands.push(
          buffer.toString("ascii", i, i + 4)
        );
      }

      if (brands.includes("avif")) {
        return "image/avif";
      }
    }
  }

  return null;
}

async function validateImage(buffer, contentType) {
  if (
    !Buffer.isBuffer(buffer) ||
    buffer.length === 0 ||
    buffer.length > MAX_IMAGE_BYTES
  ) {
    throw invalidImage();
  }

  if (detectImageType(buffer) !== contentType) {
    throw new AppError(
      "Isi file tidak sesuai dengan format gambar",
      422
    );
  }

  try {
    const image = sharp(buffer, {
      failOn: "warning",
      limitInputPixels: MAX_IMAGE_PIXELS,
      sequentialRead: true
    });

    const metadata = await image.metadata();

    const formats = {
      "image/jpeg": "jpeg",
      "image/png": "png",
      "image/webp": "webp",
      "image/avif": "heif"
    };

    if (
      metadata.format !== formats[contentType] ||
      !Number.isSafeInteger(metadata.width) ||
      !Number.isSafeInteger(metadata.height) ||
      metadata.width <= 0 ||
      metadata.height <= 0 ||
      metadata.width * metadata.height >
        MAX_IMAGE_PIXELS ||
      (metadata.pages ?? 1) !== 1
    ) {
      throw invalidImage();
    }

    if (
      contentType === "image/avif" &&
      metadata.compression !== "av1"
    ) {
      throw invalidImage();
    }

    // Decode pixel data, bukan hanya metadata.
    const decoded = await image
      .timeout({ seconds: 15 })
      .raw({ depth: "uchar" })
      .toBuffer({ resolveWithObject: true });

    if (
      decoded.data.length === 0 ||
      decoded.info.width !== metadata.width ||
      decoded.info.height !== metadata.height
    ) {
      throw invalidImage();
    }

    return {
      contentType,
      width: metadata.width,
      height: metadata.height
    };

  } catch {
    throw invalidImage();
  }
}

module.exports = {
  detectImageType,
  validateImage,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_PIXELS
};
