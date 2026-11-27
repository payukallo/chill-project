const AppError = require("../utils/AppError");
const seriesModel = require("../models/seriesModel");

// Menghapus URL video dari katalog Series publik
const sanitizePublicSeries = (series) => {
  const { video_url, episodes, ...publicSeries } = series;

  return {
    ...publicSeries,
    episodes: Array.isArray(episodes)
      ? episodes.map((episode) => {
          const { video_url, ...publicEpisode } = episode;

          return publicEpisode;
        })
      : [],
  };
};

// GET: Mengambil semua Series untuk katalog publik
const getSeries = async (req, res, next) => {
  try {
    const series = await seriesModel.getAllSeries();

    const publicSeries = series.map(sanitizePublicSeries);

    res.status(200).json(publicSeries);
  } catch (error) {
    next(error);
  }
};

// GET: Mengambil detail Series untuk katalog publik
const getSeriesById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const series = await seriesModel.getSeriesById(id);

    if (!series) {
      return next(new AppError("Series tidak ditemukan", 404));
    }

    res.status(200).json(sanitizePublicSeries(series));
  } catch (error) {
    next(error);
  }
};

// GET ADMIN: Mengambil semua Series
const getAdminSeries = async (req, res, next) => {
  try {
    res.set("Cache-Control", "private, no-store");

    const series = await seriesModel.getAllSeries();

    res.status(200).json(series);
  } catch (error) {
    next(error);
  }
};

// GET ADMIN: Mengambil detail Series berdasarkan ID
const getAdminSeriesById = async (req, res, next) => {
  try {
    res.set("Cache-Control", "private, no-store");

    const { id } = req.params;

    const series = await seriesModel.getSeriesById(id);

    if (!series) {
      return next(new AppError("Series tidak ditemukan", 404));
    }

    res.status(200).json(series);
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
  getSeriesById,
  getAdminSeries,
  getAdminSeriesById,
  createSeries,
  updateSeries,
  deleteSeries,
};
