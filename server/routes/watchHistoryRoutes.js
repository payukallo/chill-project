const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
  getWatchHistory,
  getWatchProgress,
} = require("../controllers/watchHistoryController");

const {
  registerWatchSession,
  saveSessionProgress,
} = require("../controllers/watchProgressSessionController");

// ========================================
// CONTINUE WATCHING
// ========================================

// Mengambil daftar Continue Watching pengguna
router.get("/", protect, getWatchHistory);

// Mengambil progres terakhir satu film atau episode
router.get("/progress", protect, getWatchProgress);

// ========================================
// WATCH PROGRESS SESSION
// ========================================

// Mendaftarkan sesi pemutaran baru
router.post("/sessions", protect, registerWatchSession);

// Menyimpan progres berdasarkan Session ID dan sequence
router.post("/sessions/progress", protect, saveSessionProgress);

module.exports = router;
