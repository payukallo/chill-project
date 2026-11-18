const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
  getMyList,
  addToMyList,
  removeFromMyList,
} = require("../controllers/myListController");

// GET: Mengambil My List pengguna yang sedang login
router.get("/", protect, getMyList);
router.post("/", protect, addToMyList);
router.delete("/", protect, removeFromMyList);

module.exports = router;
