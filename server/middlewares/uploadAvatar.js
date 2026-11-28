const multer = require("multer");
const AppError = require("../utils/AppError");

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const uploadAvatar = multer({
  storage: multer.memoryStorage(),

  fileFilter: (req, file, cb) => {
    if (!allowedTypes.has(file.mimetype)) {
      return cb(
        new AppError(
          "Format foto harus JPG, PNG, WEBP, atau AVIF.",
          400
        )
      );
    }

    cb(null, true);
  },

  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
});

const parseAvatar = uploadAvatar.single("avatar");

function handleAvatarUpload(req, res, next) {
  parseAvatar(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return next(
          new AppError(
            "Ukuran foto maksimal 2MB.",
            413
          )
        );
      }

      return next(
        new AppError(
          "Format request upload foto tidak valid.",
          400
        )
      );
    }

    return next(error);
  });
}

module.exports = handleAvatarUpload;
