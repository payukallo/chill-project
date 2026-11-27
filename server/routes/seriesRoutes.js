const express = require("express");
const router = express.Router();

const {
  getSeries,
  getSeriesById,
  getAdminSeries,
  getAdminSeriesById,
  createSeries,
  updateSeries,
  deleteSeries,
} = require("../controllers/seriesController");

const protect = require("../middlewares/authMiddleware");
const restrictTo = require("../middlewares/roleMiddleware");
const validateSeriesId = require("../middlewares/validateSeriesId");

// ========================================
// GET: ADMIN SERIES
// ========================================

router.get("/admin", protect, restrictTo("admin"), getAdminSeries);

router.get(
  "/admin/:id",
  protect,
  restrictTo("admin"),
  validateSeriesId,
  getAdminSeriesById,
);

// ========================================
// GET: PUBLIC CATALOG
// ========================================

router.get("/", getSeries);

router.get("/:id", validateSeriesId, getSeriesById);

// ========================================
// POST: ADMIN ONLY
// ========================================

router.post("/", protect, restrictTo("admin"), createSeries);

// ========================================
// PUT: ADMIN ONLY
// ========================================

router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  validateSeriesId,
  updateSeries,
);

// ========================================
// DELETE: ADMIN ONLY
// ========================================

router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  validateSeriesId,
  deleteSeries,
);

module.exports = router;
