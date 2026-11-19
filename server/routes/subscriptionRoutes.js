const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const {
  getAvailablePackages,
  getMySubscription,
  createSubscription,
  simulatePayment,
} = require("../controllers/subscriptionController");

// GET: Mengambil paket yang tersedia
router.get("/packages", getAvailablePackages);

// GET: Mengambil langganan pengguna yang login
router.get("/me", protect, getMySubscription);

// POST: Membuat langganan pending
router.post("/", protect, createSubscription);

// POST: Simulasi pembayaran khusus pengujian

router.post(
  "/simulate-payment",
  protect,
  (req, res, next) => {
    const simulationEnabled = process.env.PAYMENT_SIMULATION_ENABLED === "true";

    const allowedDatabase = process.env.PAYMENT_SIMULATION_DB;

    const isAllowedDatabase =
      Boolean(allowedDatabase) && process.env.DB_NAME === allowedDatabase;

    if (!simulationEnabled || !isAllowedDatabase) {
      return res.status(403).json({
        status: "fail",
        message: "Simulasi pembayaran tidak tersedia",
      });
    }
    next();
  },
  simulatePayment,
);

module.exports = router;
