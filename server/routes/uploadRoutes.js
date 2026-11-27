const express = require("express");

const protect = require("../middlewares/authMiddleware");
const restrictTo = require("../middlewares/roleMiddleware");

const {
  presignUpload,
  completeUpload
} = require("../controllers/uploadController");

const router = express.Router();

router.use(protect, restrictTo("admin"));

router.post("/presign", presignUpload);
router.post("/complete", completeUpload);

module.exports = router;
