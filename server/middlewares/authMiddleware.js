const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const db = require("../db");

const protect = async (req, res, next) => {
  try {
    // 1. Mengambil token dari Header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Token tidak ditemukan", 401));
    }

    // 2. Mengambil token
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

    // 4. Memverifikasi JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Memastikan token memiliki identitas dan versi sesi yang valid
    if (
      !Number.isSafeInteger(decoded.id) ||
      decoded.id <= 0 ||
      !Number.isSafeInteger(decoded.session_version) ||
      decoded.session_version < 1
    ) {
      return next(
        new AppError("Sesi login tidak valid, silakan login kembali", 401),
      );
    }

    // 6. Mengambil versi sesi terbaru dari MySQL
    const [rows] = await db.execute(
      `SELECT id, username, role, session_version
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [decoded.id],
    );

    const user = rows[0];

    if (!user) {
      return next(new AppError("Pengguna tidak ditemukan", 401));
    }

    // 7. Menolak token dari sesi login sebelumnya
    if (user.session_version !== decoded.session_version) {
      return next(
        new AppError(
          "Sesi login berakhir karena akun digunakan untuk login kembali",
          401,
        ),
      );
    }

    // 8. Menyimpan identitas pengguna terbaru
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return next(new AppError("Token tidak valid atau kedaluwarsa", 401));
    }

    next(error);
  }
};

module.exports = protect;
