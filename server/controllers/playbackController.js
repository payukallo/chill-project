const playbackModel = require("../models/playbackModel");
const premiumAccessService = require("../services/premiumAccessService");
const r2StorageService = require("../services/r2StorageService");
// ========================================
// GET PLAYBACK ACCESS
// ========================================

const getPlayback = async (req, res, next) => {
  try {
    // Response playback tidak boleh disimpan cache
    res.set("Cache-Control", "private, no-store");

    // ========================================
    // VALIDASI USER
    // ========================================

    const userId = req.user?.id;

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Pengguna tidak terautentikasi",
      });
    }

    // ========================================
    // VALIDASI MEDIA ID
    // ========================================

    const mediaId = Number(req.params.mediaId);

    if (!Number.isSafeInteger(mediaId) || mediaId <= 0) {
      return res.status(400).json({
        code: "INVALID_MEDIA_ID",
        message: "Media ID tidak valid",
      });
    }

    // ========================================
    // VALIDASI EPISODE ID
    // ========================================

    let episodeId = null;

    if (req.query.episodeId !== undefined) {
      if (
        typeof req.query.episodeId !== "string" ||
        !/^[1-9]\d*$/.test(req.query.episodeId)
      ) {
        return res.status(400).json({
          code: "INVALID_EPISODE_ID",
          message: "Episode ID tidak valid",
        });
      }

      episodeId = Number(req.query.episodeId);

      if (!Number.isSafeInteger(episodeId) || episodeId <= 0) {
        return res.status(400).json({
          code: "INVALID_EPISODE_ID",
          message: "Episode ID tidak valid",
        });
      }
    }

    // ========================================
    // MENGAMBIL DATA MEDIA
    // ========================================

    const media = await playbackModel.getPlaybackMedia(mediaId, episodeId);

    if (!media) {
      return res.status(404).json({
        code: "MEDIA_NOT_FOUND",
        message: "Film atau episode tidak ditemukan",
      });
    }

    // ========================================
    // VALIDASI AKSES PREMIUM
    // ========================================

    const hasAccess = await premiumAccessService.hasPremiumAccess(
      userId,
      media.is_premium,
    );

    if (!hasAccess) {
      return res.status(403).json({
        code: "PREMIUM_REQUIRED",
        message: "Konten ini khusus pengguna premium",
      });
    }

    // ========================================
    // VALIDASI KETERSEDIAAN VIDEO
    // ========================================

    if (typeof media.video_url !== "string" || !media.video_url.trim()) {
      return res.status(404).json({
        code: "VIDEO_NOT_AVAILABLE",
        message: "Video belum tersedia",
      });
    }

    // ========================================
    // PLAYBACK ACCESS GRANTED
    // ========================================

    const videoUrl = await r2StorageService.getSignedVideoUrl(
      media.video_url,
    );

    return res.status(200).json({
      message: "Akses pemutaran diizinkan",
      data: {
        mediaId: media.media_id,
        episodeId: media.episode_id,
        mediaType: media.media_type,
        isPremium: Number(media.is_premium) !== 0,
        videoUrl,
        expiresIn: r2StorageService.VIDEO_URL_TTL_SECONDS,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// EXPORT FUNCTIONS
// ========================================

module.exports = {
  getPlayback,
};
