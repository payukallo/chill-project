const movieModel = require("../models/movieModel");
const AppError = require("../utils/AppError");

// Menghapus URL video dari data katalog publik
const sanitizePublicMovie = (movie) => {
  const { video_url, ...publicMovie } = movie;

  return publicMovie;
};

// GET: Mengambil semua film untuk katalog publik
const getMovies = async (req, res, next) => {
  try {
    const movies = await movieModel.getAllMovies();

    const publicMovies = movies.map(sanitizePublicMovie);

    res.status(200).json(publicMovies);
  } catch (error) {
    next(error);
  }
};

// GET: Mengambil detail film untuk katalog publik
const getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const movie = await movieModel.getMovieById(id);

    if (!movie) {
      return next(new AppError("Film tidak ditemukan", 404));
    }

    res.status(200).json(sanitizePublicMovie(movie));
  } catch (error) {
    next(error);
  }
};

// ========================================
// GET ADMIN: Mengambil semua film
// ========================================

const getAdminMovies = async (req, res, next) => {
  try {
    res.set("Cache-Control", "private, no-store");

    const movies = await movieModel.getAllMovies();

    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

// ========================================
// GET ADMIN: Mengambil detail film
// ========================================

const getAdminMovieById = async (req, res, next) => {
  try {
    res.set("Cache-Control", "private, no-store");

    const { id } = req.params;

    const movie = await movieModel.getMovieById(id);

    if (!movie) {
      return next(new AppError("Film tidak ditemukan", 404));
    }

    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

// Validasi data film
const validateMovie = (movie, isUpdate = false) => {
  const { title, rating, year, genre, recommendation_movie_1 } = movie;

  if (
    (isUpdate || title !== undefined) &&
    (typeof title !== "string" || !title.trim())
  ) {
    return "Judul film wajib diisi";
  }

  if (title && title.trim().length > 255) {
    return "Judul film maksimal 255 karakter";
  }

  if (
    rating !== undefined &&
    (typeof rating !== "number" ||
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5)
  ) {
    return "Rating harus antara 0 sampai 5";
  }

  if (
    year !== undefined &&
    year !== null &&
    (!Number.isInteger(year) || year < 1888 || year > 2026)
  ) {
    return "Tahun film harus berupa angka bulat antara 1888 dan 2026";
  }

  if (
    genre !== undefined &&
    genre !== null &&
    (!Array.isArray(genre) ||
      genre.length > 10 ||
      !genre.every(
        (item) =>
          typeof item === "string" &&
          item.trim().length > 0 &&
          item.length <= 50,
      ))
  ) {
    return "Genre harus berupa array teks, maksimal 10 genre";
  }

  if (
    recommendation_movie_1 !== undefined &&
    recommendation_movie_1 !== null &&
    (!Array.isArray(recommendation_movie_1) ||
      recommendation_movie_1.length > 3 ||
      !recommendation_movie_1.every((id) => Number.isInteger(id) && id > 0))
  ) {
    return "Rekomendasi harus berupa array maksimal 3 ID film yang valid";
  }

  return null;
};

// POST: Menambahkan film
const createMovie = async (req, res, next) => {
  try {
    const errorMessage = validateMovie(req.body);

    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage,
      });
    }

    const result = await movieModel.createMovie({
      ...req.body,
      title: req.body.title.trim(),
    });

    res.status(201).json({
      message: "Film berhasil ditambahkan",
      movieId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

// PUT: Memperbarui film
const updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;

    const errorMessage = validateMovie(req.body, true);

    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage,
      });
    }

    const result = await movieModel.updateMovie(id, {
      ...req.body,
      title: req.body.title.trim(),
    });

    if (result.affectedRows === 0) {
      return next(new AppError("Film tidak ditemukan", 404));
    }

    res.json({
      message: "Film berhasil diperbarui",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE: Menghapus film
const deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await movieModel.deleteMovie(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Film tidak ditemukan",
      });
    }

    res.json({
      message: "Film berhasil dihapus",
    });
  } catch (error) {
    if (
      error.message ===
      "Film tidak dapat dihapus karena memiliki riwayat tontonan"
    ) {
      return next(
        new AppError(
          "Film tidak dapat dihapus karena memiliki riwayat tontonan",
          409,
        ),
      );
    }

    if (error.errno === 1644) {
      return next(new AppError("Film premium tidak boleh dihapus", 403));
    }

    next(error);
  }
};

module.exports = {
  getMovies,
  getMovieById,
  getAdminMovies,
  getAdminMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
