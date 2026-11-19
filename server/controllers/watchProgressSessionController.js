const watchProgressSessionModel = require("../models/watchProgressSessionModel");

// ========================================
// VALIDASI IDENTITAS SESI DAN MEDIA
// ========================================

const validateSessionMedia = (sessionId, mediaId, episodeId) => {
  if (!watchProgressSessionModel.isValidSessionId(sessionId)) {
    return "Format sessionId tidak valid";
  }

  if (!Number.isSafeInteger(mediaId) || mediaId <= 0) {
    return "mediaId tidak valid";
  }

  if (
    episodeId !== null &&
    (!Number.isSafeInteger(episodeId) || episodeId <= 0)
  ) {
    return "episodeId tidak valid";
  }

  return null;
};

// ========================================
// MENDAFTARKAN SESI PEMUTARAN
// ========================================

const registerWatchSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { sessionId, mediaId, episodeId = null } = req.body ?? {};
    const validationError = validateSessionMedia(sessionId, mediaId, episodeId);

    if (validationError) {
      return res.status(400).json({
        status: "fail",
        message: validationError,
      });
    }

    const result = await watchProgressSessionModel.registerActiveWatchSession({
      sessionId,
      userId,
      mediaId,
      episodeId,
    });

    return res.status(200).json({
      status: "success",
      message: "Sesi pemutaran berhasil diproses",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// MENYIMPAN PROGRES VIDEO
// ========================================

const saveSessionProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const {
      sessionId,
      mediaId,
      episodeId = null,
      sequence,
      progressSeconds,
      durationSeconds,
      isCompleted = false,
    } = req.body ?? {};

    const validationError = validateSessionMedia(sessionId, mediaId, episodeId);

    if (validationError) {
      return res.status(400).json({
        status: "fail",
        message: validationError,
      });
    }

    // Validasi urutan request
    if (!Number.isSafeInteger(sequence) || sequence <= 0) {
      return res.status(400).json({
        status: "fail",
        message: "sequence harus berupa bilangan bulat positif",
      });
    }

    // Validasi posisi dan durasi
    if (
      !Number.isSafeInteger(progressSeconds) ||
      progressSeconds < 0 ||
      !Number.isSafeInteger(durationSeconds) ||
      durationSeconds <= 0 ||
      progressSeconds > durationSeconds
    ) {
      return res.status(400).json({
        status: "fail",
        message: "Progres atau durasi video tidak valid",
      });
    }

    // Validasi status selesai
    if (typeof isCompleted !== "boolean") {
      return res.status(400).json({
        status: "fail",
        message: "isCompleted harus berupa boolean",
      });
    }

    const result = await watchProgressSessionModel.saveSessionWatchProgress({
      sessionId,
      userId,
      mediaId,
      episodeId,
      sequence,
      progressSeconds,
      durationSeconds,
      isCompleted,
    });

    return res.status(200).json({
      status: "success",
      message: "Progres tontonan berhasil diproses",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerWatchSession,
  saveSessionProgress,
};
