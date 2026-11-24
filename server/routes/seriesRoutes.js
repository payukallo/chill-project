const express = require("express");
const router = express.Router();


const {
  getSeries,
  getSeriesById,
  createSeries,
  updateSeries,
  deleteSeries,
} = require("../controllers/seriesController");

const protect = require("../middlewares/authMiddleware");
const restrictTo = require("../middlewares/roleMiddleware");
const validateSeriesId = require("../middlewares/validateSeriesId");

// GET: Semua pengguna boleh melihat katalog series
router.get("/", getSeries);

// GET: Mengambil satu Series berdasarkan ID
router.get("/:id", validateSeriesId, getSeriesById);

// POST: Hanya Admin
router.post("/", protect, restrictTo("admin"), createSeries);

// PUT: Hanya Admin
router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  validateSeriesId,
  updateSeries,
);

// DELETE: Hanya Admin
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  validateSeriesId,
  deleteSeries,
);

module.exports = router;
