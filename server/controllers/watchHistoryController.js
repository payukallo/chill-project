const watchHistoryModel = require("../models/watchHistoryModel");

// ========================================
// MENGAMBIL DAFTAR CONTINUE WATCHING
// ========================================

const getWatchHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const history = await watchHistoryModel.getWatchHistoryByUserId(userId);

    const continueWatching = [];

    for (const item of history) {
      // Film atau episode yang belum selesai
      if (item.is_completed === 0) {
        continueWatching.push(item);
        continue;
      }

      // Jika episode serial selesai, cari episode berikutnya
      if (item.media_type === "series") {
        const nextEpisode = await watchHistoryModel.getNextEpisode(
          item.media_id,
          item.episode_id,
        );

        if (nextEpisode) {
          continueWatching.push({
            ...item,
            episode_id: nextEpisode.episode_id,
            episode_number: nextEpisode.episode_number,
            episode_title: nextEpisode.episode_title,
            progress_seconds: 0,
            duration_seconds: nextEpisode.duration_minutes * 60,
            is_completed: 0,
          });
        }
      }
    }

    return res.status(200).json({
      status: "success",
      message: "Riwayat tontonan berhasil diambil",
      data: continueWatching,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// MENGAMBIL PROGRES FILM ATAU EPISODE
// ========================================

const getWatchProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const mediaId = Number(req.query.mediaId);

    const episodeId =
      req.query.episodeId === undefined ? null : Number(req.query.episodeId);

    // Validasi media ID
    if (!Number.isSafeInteger(mediaId) || mediaId <= 0) {
      return res.status(400).json({
        status: "fail",
        message: "mediaId tidak valid",
      });
    }

    // Validasi episode ID
    if (
      episodeId !== null &&
      (!Number.isSafeInteger(episodeId) || episodeId <= 0)
    ) {
      return res.status(400).json({
        status: "fail",
        message: "episodeId tidak valid",
      });
    }

    // Pastikan media dan episode sesuai
    const validation = await watchHistoryModel.validateWatchMedia(
      mediaId,
      episodeId,
    );

    if (!validation.valid) {
      return res.status(400).json({
        status: "fail",
        message: validation.message,
      });
    }

    // Ambil progres berdasarkan pengguna yang login
    const progress = await watchHistoryModel.getWatchProgressVersion(
      userId,
      mediaId,
      episodeId,
    );

    return res.status(200).json({
      status: "success",
      message: "Progres tontonan berhasil diambil",
      data: progress ?? {
        progress_seconds: 0,
        duration_seconds: null,
        is_completed: 0,
        progress_version: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWatchHistory,
  getWatchProgress,
};
