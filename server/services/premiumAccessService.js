const subscriptionModel = require("../models/subscriptionModel");

// ========================================
// CHECK PREMIUM ACCESS
// ========================================

const hasPremiumAccess = async (userId, isPremium, connection) => {
  // Validasi identitas pengguna
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return false;
  }

  // Konten Free tidak memerlukan subscription
  if (isPremium === 0 || isPremium === "0") {
    return true;
  }

  // Konten Premium memerlukan subscription aktif
  if (isPremium === 1 || isPremium === "1") {
    return subscriptionModel.hasActiveSubscription(userId, connection);
  }

  // Tolak akses jika status Premium tidak valid
  return false;
};

// ========================================
// EXPORT FUNCTIONS
// ========================================

module.exports = {
  hasPremiumAccess,
};
