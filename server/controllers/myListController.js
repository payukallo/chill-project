const myListModel = require("../models/myListModel");
const AppError = require("../utils/AppError");

// Mengambil My List pengguna
const getMyList = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const myList = await myListModel.getMyListByUserId(userId);

    res.status(200).json({
      message: "My List berhasil diambil",
      data: myList,
    });
  } catch (error) {
    next(error);
  }
};

// Menambahkan film atau series
const addToMyList = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { mediaId, mediaType } = req.body || {};

    // Validasi Media ID
    if (!Number.isSafeInteger(mediaId) || mediaId <= 0) {
      return next(
        new AppError("mediaId harus berupa bilangan bulat positif", 400),
      );
    }

    // Validasi jenis media
    if (!["movie", "series"].includes(mediaType)) {
      return next(new AppError("Jenis media harus movie atau series", 400));
    }

    // Validasi keberadaan dan kecocokan jenis media
    const mediaExists = await myListModel.checkMediaExists(mediaId, mediaType);

    if (!mediaExists) {
      return next(new AppError("Film atau series tidak ditemukan", 404));
    }

    try {
      await myListModel.addToMyList(userId, mediaId, mediaType);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return next(new AppError("Media sudah ada di My List", 409));
      }

      throw error;
    }

    res.status(201).json({
      message: "Media berhasil ditambahkan ke My List",
    });
  } catch (error) {
    next(error);
  }
};

// Menghapus film atau series
const removeFromMyList = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { mediaId, mediaType } = req.body || {};

    // Validasi Media ID
    if (!Number.isSafeInteger(mediaId) || mediaId <= 0) {
      return next(
        new AppError("mediaId harus berupa bilangan bulat positif", 400),
      );
    }

    // Validasi jenis media
    if (!["movie", "series"].includes(mediaType)) {
      return next(new AppError("Jenis media harus movie atau series", 400));
    }

    // Validasi keberadaan dan kecocokan jenis media
    const mediaExists = await myListModel.checkMediaExists(mediaId, mediaType);

    if (!mediaExists) {
      return next(new AppError("Film atau series tidak ditemukan", 404));
    }

    const deletedRows = await myListModel.removeFromMyList(
      userId,
      mediaId,
      mediaType,
    );

    if (deletedRows === 0) {
      return next(new AppError("Media tidak ditemukan di My List", 404));
    }

    res.status(200).json({
      message: "Media berhasil dihapus dari My List",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyList,
  addToMyList,
  removeFromMyList,
};
