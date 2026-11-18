const db = require("../db");

const simulatePayment = async (userId, subscriptionId) => {
  // ========================================
  // PENGAMAN SIMULASI PEMBAYARAN
  // ========================================
  
  const simulationEnabled = process.env.PAYMENT_SIMULATION_ENABLED === "true";

  const allowedDatabase = process.env.PAYMENT_SIMULATION_DB;

  const isAllowedDatabase =
    Boolean(allowedDatabase) && process.env.DB_NAME === allowedDatabase;

  if (!simulationEnabled || !isAllowedDatabase) {
    throw new Error("PAYMENT_SIMULATION_DISABLED");
  }

  // ========================================
  // VALIDASI SUBSCRIPTION ID
  // ========================================

  if (!Number.isSafeInteger(subscriptionId) || subscriptionId <= 0) {
    throw new Error("INVALID_SUBSCRIPTION_ID");
  }

  const connection = await db.getConnection();
  let transactionStarted = false;

  try {
    // ========================================
    // VALIDASI DATABASE AKTUAL
    // ========================================

    const [databaseRows] = await connection.execute(
      "SELECT DATABASE() AS database_name",
    );

    if (databaseRows[0]?.database_name !== allowedDatabase) {
      throw new Error("PAYMENT_SIMULATION_DISABLED");
    }

    // ========================================
    // MULAI TRANSAKSI
    // ========================================

    await connection.beginTransaction();
    transactionStarted = true;

    // ========================================
    // VALIDASI LANGGANAN
    // ========================================

    const [subscriptions] = await connection.execute(
      `SELECT us.id
       FROM user_subscriptions AS us
       JOIN packages AS p
         ON p.id = us.package_id
       WHERE us.id = ?
         AND us.user_id = ?
         AND us.status = 'pending'
         AND p.name = 'Individual'
         AND p.is_available = 1
       FOR UPDATE`,
      [subscriptionId, userId],
    );

    if (subscriptions.length === 0) {
      throw new Error("SUBSCRIPTION_NOT_PAYABLE");
    }

    // ========================================
    // AKTIVASI SUBSCRIPTION
    // ========================================

    const [result] = await connection.execute(
      `UPDATE user_subscriptions
       SET status = 'active',
           start_date = NOW(),
           end_date = DATE_ADD(
             NOW(),
             INTERVAL 1 MONTH
           )
       WHERE id = ?
         AND user_id = ?
         AND status = 'pending'`,
      [subscriptionId, userId],
    );

    if (result.affectedRows !== 1) {
      throw new Error("SUBSCRIPTION_NOT_PAYABLE");
    }

    // ========================================
    // COMMIT
    // ========================================

    await connection.commit();
    transactionStarted = false;

    return {
      subscriptionId,
      status: "active",
    };
  } catch (error) {
    if (transactionStarted) {
      await connection.rollback();
    }

    throw error;
  } finally {
    connection.release();
  }
};

// ========================================
// GET AVAILABLE PACKAGES
// ========================================

const getAvailablePackages = async () => {
  const [rows] = await db.execute(
    `SELECT *
     FROM packages
     WHERE is_available = 1
     ORDER BY id ASC`,
  );

  return rows;
};

// ========================================
// GET USER SUBSCRIPTION
// ========================================

const getUserSubscription = async (userId) => {
  const [rows] = await db.execute(
    `SELECT
        us.*,
        p.name AS package_name
     FROM user_subscriptions AS us
     JOIN packages AS p
       ON p.id = us.package_id
     WHERE us.user_id = ?
     ORDER BY us.id DESC
     LIMIT 1`,
    [userId],
  );

  return rows[0] || null;
};

// ========================================
// GET AVAILABLE PACKAGE BY ID
// ========================================

const getAvailablePackageById = async (packageId) => {
  const [rows] = await db.execute(
    `SELECT *
     FROM packages
     WHERE id = ?
       AND is_available = 1
     LIMIT 1`,
    [packageId],
  );

  return rows[0] || null;
};

// ========================================
// CHECK ACTIVE SUBSCRIPTION
// ========================================

const hasActiveSubscription = async (userId) => {
  const [rows] = await db.execute(
    `SELECT id
     FROM user_subscriptions
     WHERE user_id = ?
       AND status = 'active'
       AND end_date > NOW()
     LIMIT 1`,
    [userId],
  );

  return rows.length > 0;
};

// ========================================
// CREATE SUBSCRIPTION
// ========================================

const createSubscription = async (userId, packageId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Mengunci pengguna agar dua request
    // tidak membuat subscription bersamaan.

    const [users] = await connection.execute(
      `SELECT id
       FROM users
       WHERE id = ?
       FOR UPDATE`,
      [userId],
    );

    if (users.length === 0) {
      throw new Error("USER_NOT_FOUND");
    }

    // Validasi paket

    const [packages] = await connection.execute(
      `SELECT id
       FROM packages
       WHERE id = ?
         AND is_available = 1
         AND billing_interval = 'monthly'
       LIMIT 1`,
      [packageId],
    );

    if (packages.length === 0) {
      throw new Error("PACKAGE_NOT_AVAILABLE");
    }

    // Periksa subscription yang masih berlaku
    // atau sedang menunggu pembayaran.

    const [existing] = await connection.execute(
      `SELECT id
       FROM user_subscriptions
       WHERE user_id = ?
         AND (
           status = 'pending'
           OR (
             status = 'active'
             AND end_date > NOW()
           )
         )
       LIMIT 1`,
      [userId],
    );

    if (existing.length > 0) {
      throw new Error("SUBSCRIPTION_ALREADY_EXISTS");
    }

    // Buat subscription baru

    const [result] = await connection.execute(
      `INSERT INTO user_subscriptions (
         user_id,
         package_id,
         status,
         start_date,
         end_date
       )
       VALUES (
         ?,
         ?,
         'pending',
         NOW(),
         DATE_ADD(NOW(), INTERVAL 1 MONTH)
       )`,
      [userId, packageId],
    );

    await connection.commit();

    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// ========================================
// EXPORT FUNCTIONS
// ========================================

module.exports = {
  getAvailablePackages,
  getUserSubscription,
  getAvailablePackageById,
  hasActiveSubscription,
  createSubscription,
  simulatePayment,
};
