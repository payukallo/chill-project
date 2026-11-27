const db = require("../db");

// ========================================
// GET MOVIE PLAYBACK
// ========================================

const getMoviePlayback = async (mediaId) => {
  const [rows] = await db.execute(
    `SELECT
        m.id AS media_id,
        m.title,
        m.media_type,
        m.is_premium,
        mn.video_url,
        NULL AS episode_id
     FROM media_new AS m
     INNER JOIN movies_new AS mn
       ON mn.media_id = m.id
     WHERE m.id = ?
       AND m.media_type = 'movie'
     LIMIT 1`,
    [mediaId],
  );

  return rows[0] || null;
};

// ========================================
// GET SERIES EPISODE PLAYBACK
// ========================================

const getEpisodePlayback = async (mediaId, episodeId) => {
  const [rows] = await db.execute(
    `SELECT
        m.id AS media_id,
        m.title,
        m.media_type,
        m.is_premium,
        e.id AS episode_id,
        e.episode_number,
        e.title AS episode_title,
        e.video_url
     FROM media_new AS m
     INNER JOIN series_new AS s
       ON s.media_id = m.id
     INNER JOIN episodes_new AS e
       ON e.series_id = s.media_id
     WHERE m.id = ?
       AND m.media_type = 'series'
       AND e.id = ?
     LIMIT 1`,
    [mediaId, episodeId],
  );

  return rows[0] || null;
};

// ========================================
// GET PLAYBACK MEDIA
// ========================================

const getPlaybackMedia = async (mediaId, episodeId = null) => {
  if (episodeId === null) {
    return getMoviePlayback(mediaId);
  }

  return getEpisodePlayback(mediaId, episodeId);
};

// ========================================
// EXPORT FUNCTIONS
// ========================================

module.exports = {
  getPlaybackMedia,
  getMoviePlayback,
  getEpisodePlayback,
};
