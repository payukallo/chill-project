const subscriptionModel = require("../models/subscriptionModel");

// GET: Mengambil paket langganan yang tersedia
const getAvailablePackages = async (req, res, next) => {
  try {
    const packages = await subscriptionModel.getAvailablePackages();

    res.status(200).json({
      message: "Paket langganan berhasil diambil",
      data: packages,
    });
  } catch (error) {
    next(error);
  }
};

// GET: Mengambil langganan pengguna yang sedang login
const getMySubscription = async (req, res, next) => {
  try {
    // ID pengguna berasal dari JWT yang sudah diverifikasi
    const userId = req.user.id;

    const subscription = await subscriptionModel.getUserSubscription(userId);

    res.status(200).json({
      message: "Data langganan berhasil diambil",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

const AppError = require("../utils/AppError");

// POST: Membuat langganan baru
const createSubscription = async (req, res, next) => {
  try {
    // User ID diambil dari JWT, bukan dari request body
    const userId = req.user.id;
    const { packageId } = req.body;

    // Validasi packageId
    if (!Number.isSafeInteger(packageId) || packageId <= 0) {
      return next(
        new AppError("packageId harus berupa bilangan bulat positif", 400),
      );
    }

    // Membuat langganan melalui model
    const subscriptionId = await subscriptionModel.createSubscription(
      userId,
      packageId,
    );

    res.status(201).json({
      message: "Langganan berhasil dibuat dan menunggu pembayaran",
      data: {
        subscriptionId,
        status: "pending",
      },
    });
  } catch (error) {
    if (error.message === "PACKAGE_NOT_AVAILABLE") {
      return next(new AppError("Paket langganan tidak tersedia", 404));
    }
    console.error("CREATE SUBSCRIPTION ERROR:", error);

    if (error.message === "SUBSCRIPTION_ALREADY_EXISTS") {
      return next(
        new AppError(
          "Pengguna sudah memiliki langganan aktif atau pending",
          409,
        ),
      );
    }

    if (error.message === "USER_NOT_FOUND") {
      return next(new AppError("Pengguna tidak ditemukan", 404));
    }

    next(error);
  }
};

const simulatePayment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { subscriptionId } = req.body;

    // Validasi ID langganan
    if (!Number.isSafeInteger(subscriptionId) || subscriptionId <= 0) {
      return next(
        new AppError("subscriptionId harus berupa bilangan bulat positif", 400),
      );
    }

    // Simulasi pembayaran melalui model
    const result = await subscriptionModel.simulatePayment(
      userId,
      subscriptionId,
    );

    res.status(200).json({
      message: "Simulasi pembayaran berhasil",
      data: result,
    });
  } catch (error) {
    if (error.message === "PAYMENT_SIMULATION_DISABLED") {
      return next(new AppError("Simulasi pembayaran tidak tersedia", 403));
    }

    if (error.message === "SUBSCRIPTION_NOT_PAYABLE") {
      return next(
        new AppError("Langganan tidak ditemukan atau tidak dapat dibayar", 409),
      );
    }

    if (error.message === "INVALID_SUBSCRIPTION_ID") {
      return next(new AppError("subscriptionId tidak valid", 400));
    }

    next(error);
  }
};

module.exports = {
  getAvailablePackages,
  getMySubscription,
  createSubscription,
  simulatePayment,
};
