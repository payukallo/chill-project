const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const { getPlayback } = require("../controllers/playbackController");

// ========================================
// GET PLAYBACK ACCESS
// ========================================

router.get("/:mediaId", protect, getPlayback);

module.exports = router;
