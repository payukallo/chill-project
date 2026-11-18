const db = require("../db");
const watchHistoryModel = require("./watchHistoryModel");

// Memeriksa apakah nomor urut request lebih baru
const isValidWatchSequence = (sequence, lastSequence) => {
  const current = Number(sequence);
  const previous = Number(lastSequence);

  // Nomor urut harus berupa bilangan bulat positif yang aman
  if (
    !Number.isSafeInteger(current) ||
    current <= 0 ||
    !Number.isSafeInteger(previous) ||
    previous < 0
  ) {
    return false;
  }

  // Hanya menerima request dengan urutan lebih baru
  return current > previous;
};

// Mengambil dan mengunci sesi pemutaran dalam transaksi MySQL
const getLockedWatchSession = async (connection, sessionId) => {
  const [rows] = await connection.execute(
    `SELECT
        id,
        session_id,
        user_id,
        media_id,
        episode_id,
        last_sequence
     FROM watch_progress_sessions
     WHERE session_id = ?
     LIMIT 1
     FOR UPDATE`,
    [sessionId],
  );

  return rows[0] ?? null;
};

// Menjalankan operasi Watch History dalam satu transaksi MySQL
const runWatchProgressTransaction = async (callback) => {
  const connection = await db.getConnection();

  try {
    // Memulai transaksi
    await connection.beginTransaction();

    // Semua query dalam callback harus menggunakan connection ini
    const result = await callback(connection);

    // Simpan seluruh perubahan jika berhasil
    await connection.commit();

    return result;
  } catch (error) {
    // Batalkan perubahan jika terjadi kesalahan
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error(
        "Gagal melakukan rollback transaksi Watch History:",
        rollbackError,
      );
    }

    throw error;
  } finally {
    // Kembalikan koneksi ke connection pool
    connection.release();
  }
};

// Memperbarui nomor urut terakhir dalam transaksi MySQL
const updateWatchSessionSequence = async (connection, sessionId, sequence) => {
  const [result] = await connection.execute(
    `UPDATE watch_progress_sessions
     SET last_sequence = ?
     WHERE session_id = ?
       AND last_sequence < ?`,
    [sequence, sessionId, sequence],
  );

  return result.affectedRows === 1;
};

// Menyimpan progres berdasarkan sesi dalam satu transaksi
const saveSessionWatchProgress = async ({
  sessionId,
  userId,
  mediaId,
  episodeId,
  sequence,
  progressSeconds,
  durationSeconds,
  isCompleted,
}) => {
  return runWatchProgressTransaction(async (connection) => {
    // Kunci sesi sampai transaksi selesai
    const session = await getLockedWatchSession(connection, sessionId);

    // Pastikan sesi tersedia dan identitasnya sesuai
    if (
      !session ||
      session.user_id !== userId ||
      session.media_id !== mediaId ||
      session.episode_id !== episodeId
    ) {
      const error = new Error(
        "Sesi pemutaran tidak ditemukan atau tidak sesuai",
      );
      error.statusCode = 403;
      throw error;
    }

    // Pastikan nomor urut request lebih baru
    if (!isValidWatchSequence(sequence, session.last_sequence)) {
      const error = new Error("Nomor urut request sudah kedaluwarsa");
      error.statusCode = 409;
      throw error;
    }

    // Pastikan riwayat tersedia dan kunci barisnya
    const history = await watchHistoryModel.ensureAndLockWatchHistory(
      connection,
      userId,
      mediaId,
      episodeId,
    );

    // Tolak request jika sesi lain sudah mengambil alih riwayat
    if (
      history.active_session_id !== null &&
      history.active_session_id !== sessionId
    ) {
      const error = new Error("Sesi pemutaran sudah digantikan oleh sesi lain");

      error.statusCode = 409;
      throw error;
    }

    // Riwayat yang sudah selesai tidak boleh diubah
    if (history.is_completed === 1) {
      return {
        success: true,
        alreadyCompleted: true,
        lastSequence: Number(session.last_sequence),
      };
    }

    // Tetapkan sesi pertama sebagai sesi aktif
    if (history.active_session_id === null) {
      const activated = await watchHistoryModel.activateWatchSession(
        connection,
        userId,
        mediaId,
        episodeId,
        sessionId,
      );

      if (!activated) {
        throw new Error("Gagal menetapkan sesi pemutaran aktif");
      }
    }

    // Simpan progres menggunakan koneksi transaksi yang sama
    await watchHistoryModel.saveWatchProgressInTransaction(
      connection,
      userId,
      mediaId,
      episodeId,
      progressSeconds,
      durationSeconds,
      isCompleted,
    );

    // Perbarui nomor urut sesi
    const sequenceUpdated = await updateWatchSessionSequence(
      connection,
      sessionId,
      sequence,
    );

    if (!sequenceUpdated) {
      throw new Error("Gagal memperbarui nomor urut sesi");
    }

    return {
      success: true,
      lastSequence: sequence,
    };
  });
};

// Mendaftarkan sesi baru dan menjadikannya sesi aktif
const registerActiveWatchSession = async ({
  sessionId,
  userId,
  mediaId,
  episodeId,
}) => {
  if (!isValidSessionId(sessionId)) {
    const error = new Error("Format sessionId tidak valid");
    error.statusCode = 400;
    throw error;
  }

  try {
    return await runWatchProgressTransaction(async (connection) => {
      const validation = await watchHistoryModel.validateWatchMedia(
        mediaId,
        episodeId,
      );

      if (!validation.valid) {
        const error = new Error(validation.message);
        error.statusCode = 400;
        throw error;
      }

      // Periksa penggunaan sessionId sebelum membuat sesi baru
      const existing = await checkExistingWatchSession(
        connection,
        sessionId,
        userId,
        mediaId,
        episodeId,
      );

      if (existing.exists && !existing.matches) {
        const error = new Error(
          "sessionId sudah digunakan untuk sesi pemutaran lain",
        );
        error.statusCode = 409;
        throw error;
      }

      if (existing.exists && existing.matches) {
        const history = await watchHistoryModel.getLockedWatchHistory(
          connection,
          userId,
          mediaId,
          episodeId,
        );

        return {
          success: true,
          alreadyRegistered: true,
          isActive: history?.active_session_id === sessionId,
          alreadyCompleted: history?.is_completed === 1,
          sessionId,
          lastSequence: Number(existing.session.last_sequence),
        };
      }

      // Kunci Watch History sebelum menentukan perlu tidaknya sesi baru
      const history = await watchHistoryModel.ensureAndLockWatchHistory(
        connection,
        userId,
        mediaId,
        episodeId,
      );

      // Episode selesai: jangan membuat record sesi baru
      if (history.is_completed === 1) {
        return {
          success: true,
          alreadyCompleted: true,
          sessionId,
        };
      }

      // Hanya episode yang belum selesai yang membuat sesi baru
      await connection.execute(
        `INSERT INTO watch_progress_sessions (
          session_id,
          user_id,
          media_id,
          episode_id,
          last_sequence
        )
        VALUES (?, ?, ?, ?, 0)`,
        [sessionId, userId, mediaId, episodeId],
      );

      const activated = await watchHistoryModel.takeOverWatchSession(
        connection,
        userId,
        mediaId,
        episodeId,
        sessionId,
      );

      if (!activated) {
        throw new Error("Gagal mengambil alih sesi pemutaran");
      }

      return {
        success: true,
        alreadyCompleted: false,
        sessionId,
      };
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const conflict = new Error(
        "sessionId sudah terdaftar. Periksa status sesi sebelum mencoba lagi.",
      );
      conflict.statusCode = 409;
      throw conflict;
    }

    throw error;
  }
};

// Memvalidasi format UUID sesi pemutaran
const isValidSessionId = (sessionId) => {
  if (typeof sessionId !== "string") {
    return false;
  }

  // Menerima UUID standar versi 1–8
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(sessionId);
};

// Memeriksa apakah sessionId sudah digunakan
// dan apakah identitasnya sesuai
const checkExistingWatchSession = async (
  connection,
  sessionId,
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
        last_sequence
     FROM watch_progress_sessions
     WHERE session_id = ?
     LIMIT 1`,
    [sessionId],
  );

  const existingSession = rows[0];

  if (!existingSession) {
    return {
      exists: false,
      matches: false,
    };
  }

  const matches =
    existingSession.user_id === userId &&
    existingSession.media_id === mediaId &&
    existingSession.episode_id === episodeId;

  return {
    exists: true,
    matches,
    session: existingSession,
  };
};

// Hanya fungsi yang digunakan oleh controller diekspor.
module.exports = {
  registerActiveWatchSession,
  saveSessionWatchProgress,
  isValidSessionId,
};
