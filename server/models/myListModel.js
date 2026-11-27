const db = require("../db");

// Mengambil semua My List milik pengguna dari database

const getMyListByUserId = async (userId) => {
  const connection = await db.getConnection();

  try {
    // Query 1: Ambil My List pengguna
    const [rows] = await connection.execute(
      `SELECT
          ml.id AS my_list_id,
          ml.media_id,
          m.media_type,
          ml.created_at,
          m.title,
          m.description,
          m.rating,
          m.year,
          CASE
            WHEN m.media_type = 'movie'
              THEN CONCAT(mv.duration_minutes, ' min')
            ELSE (
              SELECT CONCAT(COUNT(*), ' Episodes')
              FROM episodes_new e
              WHERE e.series_id = m.id
            )
          END AS duration,
          m.cover_url,
          m.banner_url,
          m.is_premium,
          m.is_top_10,
          m.is_top_rating_today AS top_rating_today,
          m.film_maker,
          m.age_rating,
          m.cast_members,
          m.is_new_episode
       FROM my_list_new ml
       JOIN media_new m ON ml.media_id = m.id
       LEFT JOIN movies_new mv
         ON m.id = mv.media_id AND m.media_type = 'movie'
       WHERE ml.user_id = ?
       ORDER BY ml.created_at DESC, ml.id DESC`,
      [userId],
    );

    if (rows.length === 0) return [];

    // Query 2: Ambil genre seluruh konten My List
    const [genres] = await connection.execute(
      `SELECT mg.media_id, g.name
       FROM media_genres mg
       JOIN genres g ON mg.genre_id = g.id
       JOIN my_list_new ml ON ml.media_id = mg.media_id
       WHERE ml.user_id = ?
       ORDER BY mg.media_id, g.id`,
      [userId],
    );

    // Query 3: Ambil episode untuk serial di My List
    const [episodes] = await connection.execute(
      `SELECT
          e.series_id,
          e.id AS episode_id,
          e.episode_number,
          e.title,
          e.description,
          CASE
            WHEN e.duration IS NULL THEN NULL
            ELSE CONCAT(e.duration, ' min')
          END AS duration,
          e.cover_url AS thumbnail
       FROM episodes_new e
       JOIN my_list_new ml ON ml.media_id = e.series_id
       WHERE ml.user_id = ?
       ORDER BY e.series_id, e.episode_number`,
      [userId],
    );

    // Query 4: Ambil rekomendasi film di My List
    const [recommendations] = await connection.execute(
      `SELECT r.movie_id, r.recommended_movie_id
       FROM movie_recommendations_new r
       JOIN my_list_new ml ON ml.media_id = r.movie_id
       WHERE ml.user_id = ?
       ORDER BY r.movie_id, r.position`,
      [userId],
    );

    const genreMap = new Map();
    const episodeMap = new Map();
    const recommendationMap = new Map();

    for (const genre of genres) {
      if (!genreMap.has(genre.media_id)) {
        genreMap.set(genre.media_id, []);
      }
      genreMap.get(genre.media_id).push(genre.name);
    }

    for (const episode of episodes) {
      if (!episodeMap.has(episode.series_id)) {
        episodeMap.set(episode.series_id, []);
      }

      const { series_id, ...data } = episode;
      episodeMap.get(series_id).push(data);
    }

    for (const recommendation of recommendations) {
      if (!recommendationMap.has(recommendation.movie_id)) {
        recommendationMap.set(recommendation.movie_id, []);
      }

      recommendationMap
        .get(recommendation.movie_id)
        .push(recommendation.recommended_movie_id);
    }

    return rows.map((row) => {
      row.genre = genreMap.get(row.media_id) ?? [];

      if (row.media_type === "series") {
        row.episodes = episodeMap.get(row.media_id) ?? [];
        row.recommendation_movie_1 = null;
      } else {
        row.episodes = null;
        row.recommendation_movie_1 = recommendationMap.get(row.media_id) ?? [];
      }

      return row;
    });
  } finally {
    connection.release();
  }
};

// Menambahkan film atau series ke My List
const addToMyList = async (userId, mediaId, mediaType) => {
  const [result] = await db.execute(
    `INSERT INTO my_list_new (user_id, media_id)
     VALUES (?, ?)`,
    [userId, mediaId],
  );

  return result.insertId;
};

// Memeriksa apakah film atau series tersedia
const checkMediaExists = async (mediaId, mediaType) => {
  const [rows] = await db.execute(
    `SELECT id
     FROM media_new
     WHERE id = ?
       AND media_type = ?
     LIMIT 1`,
    [mediaId, mediaType],
  );

  return rows.length > 0;
};

// Menghapus media dari My List pengguna
const removeFromMyList = async (userId, mediaId, mediaType) => {
  const [result] = await db.execute(
    `DELETE FROM my_list_new
     WHERE user_id = ?
       AND media_id = ?
       AND EXISTS (
         SELECT 1
         FROM media_new
         WHERE id = ?
           AND media_type = ?
       )`,
    [userId, mediaId, mediaId, mediaType],
  );

  return result.affectedRows;
};

module.exports = {
  getMyListByUserId,
  addToMyList,
  checkMediaExists,
  removeFromMyList,
};
