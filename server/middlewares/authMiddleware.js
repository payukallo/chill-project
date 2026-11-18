const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const protect = (req, res, next) => {
  try {
    // 1. Mengambil token dari Header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Token tidak ditemukan", 401));
    }

    // 2. Mengambil bagian token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(new AppError("Token tidak ditemukan", 401));
    }

    // 3. Memastikan JWT_SECRET tersedia
    if (!process.env.JWT_SECRET) {
      return next(
        new AppError("Konfigurasi autentikasi server bermasalah", 500),
      );
    }

    // 4. Memverifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Menyimpan informasi pengguna ke request
    req.user = decoded;

    // 6. Melanjutkan ke proses berikutnya
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(new AppError("Token tidak valid atau kedaluwarsa", 401));
    }

    next(error);
  }
};

module.exports = protect;
