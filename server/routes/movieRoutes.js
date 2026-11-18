const express = require("express");
const router = express.Router();

const {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");

const validateMovieId = require("../middlewares/validateMovieId");
const protect = require("../middlewares/authMiddleware");
const restrictTo = require("../middlewares/roleMiddleware");

// GET: Semua orang boleh melihat katalog
router.get("/", getMovies);

// POST: Hanya admin yang boleh menambahkan film
router.post("/", protect, restrictTo("admin"), createMovie);

// PUT: Hanya admin yang boleh memperbarui film
router.put("/:id", protect, restrictTo("admin"), validateMovieId, updateMovie);

// DELETE: Hanya admin yang boleh menghapus film
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  validateMovieId,
  deleteMovie,
);

module.exports = router;
