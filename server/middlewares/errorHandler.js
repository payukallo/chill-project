const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack || err.message);
  } else {
    console.error(err.message);
  }

  // Username atau email sudah terdaftar
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      status: "error",
      message: "Username atau email sudah digunakan.",
    });
  }

  // Pastikan status code selalu berupa angka
  const statusCode = Number(err.statusCode) || 500;

  const message =
    statusCode >= 500
      ? "Terjadi kesalahan pada server"
      : err.message || "Terjadi kesalahan";

  res.status(statusCode).json({
    status: err.status || "error",
    message,
  });
};

module.exports = errorHandler;
