const db = require("../db");

// Mengambil riwayat tontonan terbaru yang sudah diputar
const getWatchHistoryByUserId = async (userId) => {
  const [rows] = await db.execute(
    `SELECT
        wh.id,
        wh.user_id,
        wh.media_id,
        wh.episode_id,
        wh.progress_seconds,
        wh.duration_seconds,
        wh.is_completed,
        wh.last_watched_at,
        m.media_type,
        m.title,
        m.cover_url,
        m.banner_url,
        e.episode_number,
        e.title AS episode_title
     FROM watch_history wh
     JOIN media_new m
       ON wh.media_id = m.id
     LEFT JOIN episodes_new e
       ON wh.episode_id = e.id
     WHERE wh.user_id = ?
       AND (
         wh.progress_seconds > 0
         OR wh.is_completed = 1
       )
      AND NOT EXISTS (
         SELECT 1
         FROM watch_history newer
         WHERE newer.user_id = wh.user_id
           AND newer.media_id = wh.media_id
           AND (
             newer.progress_seconds > 0
             OR newer.is_completed = 1
           )
           AND (
             newer.last_watched_at > wh.last_watched_at
             OR (
               newer.last_watched_at = wh.last_watched_at
               AND newer.id > wh.id
             )
           )
       )
     ORDER BY wh.last_watched_at DESC, wh.id DESC`,
    [userId],
  );

  return rows;
};

// Memvalidasi media dan episode sebelum menyimpan progres
const validateWatchMedia = async (mediaId, episodeId, connection = db) => {
  const [rows] = await connection.execute(
    `SELECT
      m.id,
      m.media_type,
      m.is_premium,
      e.id AS valid_episode_id
     FROM media_new m
     LEFT JOIN episodes_new e
       ON e.series_id = m.id
       AND e.id = ?
     WHERE m.id = ?
     LIMIT 1`,
    [episodeId, mediaId],
  );

  if (rows.length === 0) {
    return {
      valid: false,
      message: "Film atau serial tidak ditemukan",
    };
  }

  const media = rows[0];

  if (media.media_type === "movie" && episodeId !== null) {
    return {
      valid: false,
      message: "Movie tidak boleh memiliki episodeId",
    };
  }

  if (media.media_type === "series" && episodeId === null) {
    return {
      valid: false,
      message: "Series wajib memiliki episodeId",
    };
  }

  if (media.media_type === "series" && media.valid_episode_id === null) {
    return {
      valid: false,
      message: "Episode tidak ditemukan pada serial ini",
    };
  }

  return {
    valid: true,
    mediaType: media.media_type,
    isPremium: media.is_premium,
  };
};

// Mencari episode berikutnya berdasarkan nomor episode
const getNextEpisode = async (mediaId, episodeId) => {
  const [rows] = await db.execute(
    `SELECT
        next_episode.id AS episode_id,
        next_episode.episode_number,
        next_episode.title AS episode_title,
        next_episode.duration AS duration_minutes
     FROM episodes_new current_episode
     JOIN episodes_new next_episode
       ON next_episode.series_id = current_episode.series_id
       AND next_episode.episode_number > current_episode.episode_number
     WHERE current_episode.id = ?
       AND current_episode.series_id = ?
     ORDER BY next_episode.episode_number ASC
     LIMIT 1`,
    [episodeId, mediaId],
  );

  return rows[0] || null;
};

// Mengambil versi progres terbaru milik pengguna
const getWatchProgressVersion = async (userId, mediaId, episodeId) => {
  const [rows] = await db.execute(
    `SELECT
        id,
        progress_seconds,
        duration_seconds,
        is_completed,
        progress_version
     FROM watch_history
     WHERE user_id = ?
       AND media_id = ?
       AND episode_key = IFNULL(?, 0)
     LIMIT 1`,
    [userId, mediaId, episodeId],
  );

  return rows[0] ?? null;
};

// Menyimpan progres menggunakan koneksi transaksi MySQL
const saveWatchProgressInTransaction = async (
  connection,
  userId,
  mediaId,
  episodeId,
  progressSeconds,
  durationSeconds,
  isCompleted,
) => {
  const [result] = await connection.execute(
    `INSERT INTO watch_history (
      user_id,
      media_id,
      episode_id,
      progress_seconds,
      duration_seconds,
      is_completed,
      progress_version,
      last_watched_at
    )
    VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)

    ON DUPLICATE KEY UPDATE
      progress_seconds = IF(
        is_completed = 1,
        progress_seconds,
        VALUES(progress_seconds)
      ),

      duration_seconds = IF(
        is_completed = 1,
        duration_seconds,
        VALUES(duration_seconds)
      ),

      progress_version = IF(
        is_completed = 1,
        progress_version,
        progress_version + 1
      ),

      last_watched_at = IF(
        is_completed = 1,
        last_watched_at,
        CURRENT_TIMESTAMP
      ),

      is_completed = GREATEST(
        is_completed,
        VALUES(is_completed)
      )`,
    [
      userId,
      mediaId,
      episodeId,
      progressSeconds,
      durationSeconds,
      isCompleted ? 1 : 0,
    ],
  );

  return result.affectedRows;
};

// Menetapkan sesi aktif untuk Movie atau Episode
// Harus dipanggil melalui koneksi transaksi MySQL
const activateWatchSession = async (
  connection,
  userId,
  mediaId,
  episodeId,
  sessionId,
) => {
  const [result] = await connection.execute(
    `UPDATE watch_history
     SET active_session_id = ?
     WHERE user_id = ?
       AND media_id = ?
       AND episode_key = IFNULL(?, 0)`,
    [sessionId, userId, mediaId, episodeId],
  );

  return result.affectedRows === 1;
};

// Mengambil dan mengunci riwayat tontonan dalam transaksi MySQL
const getLockedWatchHistory = async (
  connection,
  userId,
  mediaId,
  episodeId,
) => {
  const [rows] = await connection.execute(
    `SELECT
        id,
        user_id,
        media_id,
        episode_id,
        progress_seconds,
        duration_seconds,
        is_completed,
        progress_version,
        active_session_id
     FROM watch_history
     WHERE user_id = ?
       AND media_id = ?
       AND episode_key = IFNULL(?, 0)
     LIMIT 1
     FOR UPDATE`,
    [userId, mediaId, episodeId],
  );

  return rows[0] ?? null;
};

// Memastikan riwayat tontonan tersedia sebelum dikunci
// Harus dipanggil menggunakan koneksi transaksi MySQL
const ensureWatchHistoryExists = async (
  connection,
  userId,
  mediaId,
  episodeId,
) => {
  await connection.execute(
    `INSERT INTO watch_history (
      user_id,
      media_id,
      episode_id,
      progress_seconds,
      duration_seconds,
      is_completed,
      progress_version
    )
    VALUES (?, ?, ?, 0, NULL, 0, 0)
    ON DUPLICATE KEY UPDATE
      id = id`,
    [userId, mediaId, episodeId],
  );
};

// Memastikan riwayat tersedia dan menguncinya dalam transaksi
const ensureAndLockWatchHistory = async (
  connection,
  userId,
  mediaId,
  episodeId,
) => {
  // Buat riwayat awal jika belum tersedia
  await ensureWatchHistoryExists(connection, userId, mediaId, episodeId);

  // Kunci baris riwayat sampai transaksi selesai
  const history = await getLockedWatchHistory(
    connection,
    userId,
    mediaId,
    episodeId,
  );

  if (!history) {
    throw new Error("Gagal mengambil riwayat tontonan setelah dibuat");
  }

  return history;
};

// Mengambil alih sesi aktif melalui koneksi transaksi MySQL
const takeOverWatchSession = async (
  connection,
  userId,
  mediaId,
  episodeId,
  newSessionId,
) => {
  const [result] = await connection.execute(
    `UPDATE watch_history
     SET active_session_id = ?
     WHERE user_id = ?
       AND media_id = ?
       AND episode_key = IFNULL(?, 0)
       AND is_completed = 0`,
    [newSessionId, userId, mediaId, episodeId],
  );

  return result.affectedRows === 1;
};

// Reset Watch History ketika video selesai diputar ulang.
// Hanya dipanggil dalam transaksi dengan Watch History terkunci.
const resetCompletedWatchForReplay = async (
  connection,
  userId,
  mediaId,
  episodeId,
) => {
  const [result] = await connection.execute(
    `UPDATE watch_history
     SET progress_seconds = 0,
         duration_seconds = NULL,
         is_completed = 0,
         progress_version = progress_version + 1,
         active_session_id = NULL,
         last_watched_at = CURRENT_TIMESTAMP
     WHERE user_id = ?
       AND media_id = ?
       AND episode_key = IFNULL(?, 0)
       AND is_completed = 1`,
    [userId, mediaId, episodeId],
  );

  return result.affectedRows === 1;
};

module.exports = {
  getWatchHistoryByUserId,
  validateWatchMedia,
  getNextEpisode,
  getWatchProgressVersion,
  saveWatchProgressInTransaction,
  activateWatchSession,
  getLockedWatchHistory,
  ensureWatchHistoryExists,
  ensureAndLockWatchHistory,
  takeOverWatchSession,
  resetCompletedWatchForReplay,
};
