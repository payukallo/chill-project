const express = require("express");
const router = express.Router();
const restrictTo = require("../middlewares/roleMiddleware");
const protect = require("../middlewares/authMiddleware");
const uploadAvatar = require("../middlewares/uploadAvatar");
const {
  loginLimiter,
  registerLimiter,
} = require("../middlewares/authRateLimiter");

const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
} = require("../controllers/userController");

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);

router.get("/profile", protect, getProfile);
router.patch("/profile", protect, updateProfile);
router.patch("/change-password", protect, changePassword);

// Upload foto profil
router.patch(
  "/profile/avatar",
  protect,
  uploadAvatar.single("avatar"),
  uploadProfileImage,
);

router.get("/admin-test", protect, restrictTo("admin"), (req, res) => {
  res.status(200).json({
    message: "Selamat datang, Admin!",
    user: req.user,
  });
});

module.exports = router;
