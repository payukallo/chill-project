const AppError = require("../utils/AppError");
const seriesModel = require("../models/seriesModel");

// GET: Mengambil semua series
const getSeries = async (req, res, next) => {
  try {
    const series = await seriesModel.getAllSeries();
    res.json(series);
  } catch (error) {
    next(error);
  }
};

// POST: Menambahkan series
const createSeries = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Judul series wajib diisi",
      });
    }

    const seriesId = await seriesModel.createSeries(req.body);

    res.status(201).json({
      message: "Series berhasil ditambahkan",
      seriesId,
    });
  } catch (error) {
    next(error);
  }
};

// PUT: Memperbarui series
const updateSeries = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Judul series wajib diisi",
      });
    }

    const affectedRows = await seriesModel.updateSeries(
      req.params.id,
      req.body,
    );

    if (affectedRows === 0) {
      return res.status(404).json({
        message: "Series tidak ditemukan",
      });
    }

    res.json({
      message: "Series berhasil diperbarui",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE: Menghapus series
const deleteSeries = async (req, res, next) => {
  try {
    const affectedRows = await seriesModel.deleteSeries(req.params.id);

    if (affectedRows === 0) {
      return res.status(404).json({
        message: "Series tidak ditemukan",
      });
    }

    res.json({
      message: "Series berhasil dihapus",
    });
  } catch (error) {
    if (
      error.message ===
      "Serial tidak dapat dihapus karena memiliki riwayat tontonan"
    ) {
      return next(
        new AppError(
          "Serial tidak dapat dihapus karena memiliki riwayat tontonan",
          409,
        ),
      );
    }

    next(error);
  }
};

module.exports = {
  getSeries,
  createSeries,
  updateSeries,
  deleteSeries,
};
