const express = require("express");
const router = express.Router();

const {
  getMovies,
  getMovieById,
  getAdminMovies,
  getAdminMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");

const validateMovieId = require("../middlewares/validateMovieId");
const protect = require("../middlewares/authMiddleware");
const restrictTo = require("../middlewares/roleMiddleware");

// ========================================
// GET: ADMIN MOVIES
// ========================================

router.get("/admin", protect, restrictTo("admin"), getAdminMovies);

router.get(
  "/admin/:id",
  protect,
  restrictTo("admin"),
  validateMovieId,
  getAdminMovieById,
);

// ========================================
// GET: PUBLIC CATALOG
// ========================================

router.get("/", getMovies);

router.get("/:id", validateMovieId, getMovieById);

// ========================================
// POST: ADMIN ONLY
// ========================================

router.post("/", protect, restrictTo("admin"), createMovie);

// ========================================
// PUT: ADMIN ONLY
// ========================================

router.put("/:id", protect, restrictTo("admin"), validateMovieId, updateMovie);

// ========================================
// DELETE: ADMIN ONLY
// ========================================

router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  validateMovieId,
  deleteMovie,
);

module.exports = router;
