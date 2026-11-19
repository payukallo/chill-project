const db = require("../db");

const createUser = async (username, email, password) => {
  const [result] = await db.execute(
    `INSERT INTO users (username, email, password)
     VALUES (?, ?, ?)`,
    [username, email, password],
  );

  return result;
};

const findUserByUsername = async (username) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
    username,
  ]);

  return rows[0];
};

const findUserById = async (id) => {
  const [rows] = await db.execute(
    `SELECT id, username, email, avatar_url, role, created_at
     FROM users
     WHERE id = ?`,
    [id],
  );

  return rows[0];
};

const findUserWithPassword = async (id) => {
  const [rows] = await db.execute(
    `SELECT id, password
     FROM users
     WHERE id = ?`,
    [id],
  );

  return rows[0];
};

const updateUser = async (id, username, email) => {
  const [result] = await db.execute(
    `UPDATE users
     SET username = ?, email = ?
     WHERE id = ?`,
    [username, email, id],
  );

  return result;
};

const updatePassword = async (id, hashedPassword) => {
  const [result] = await db.execute(
    `UPDATE users
     SET password = ?
     WHERE id = ?`,
    [hashedPassword, id],
  );

  return result;
};

// UPDATE AVATAR URL
const updateAvatarUrl = async (id, avatarUrl) => {
  const [result] = await db.execute(
    `UPDATE users
     SET avatar_url = ?
     WHERE id = ?`,
    [avatarUrl, id],
  );

  return result;
};

const incrementSessionVersion = async (userId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `UPDATE users
       SET session_version = session_version + 1,
           last_login_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [userId],
    );

    if (result.affectedRows !== 1) {
      throw new Error("Pengguna tidak ditemukan");
    }

    const [rows] = await connection.execute(
      `SELECT session_version
       FROM users
       WHERE id = ?`,
      [userId],
    );

    await connection.commit();

    return rows[0].session_version;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
  findUserWithPassword,
  updateUser,
  updatePassword,
  updateAvatarUrl,
  incrementSessionVersion,
};
