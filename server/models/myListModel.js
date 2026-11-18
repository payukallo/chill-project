const db = require("../db");

// Mengambil semua My List milik pengguna dari database
const getMyListByUserId = async (userId) => {
  const [rows] = await db.execute(
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
        mv.video_url,
        m.is_premium,
        m.is_top_10,
        m.is_top_rating_today AS top_rating_today,
        m.film_maker,
        m.age_rating,
        m.cast_members,
        m.is_new_episode
     FROM my_list_new ml
     JOIN media_new m
       ON ml.media_id = m.id
     LEFT JOIN movies_new mv
       ON m.id = mv.media_id
       AND m.media_type = 'movie'
     LEFT JOIN series_new s
       ON m.id = s.media_id
       AND m.media_type = 'series'
     WHERE ml.user_id = ?
     ORDER BY ml.created_at DESC, ml.id DESC`,
    [userId],
  );

  for (const row of rows) {
    // Ambil genre sebagai array string
    const [genres] = await db.execute(
      `SELECT g.name
       FROM media_genres mg
       JOIN genres g ON mg.genre_id = g.id
       WHERE mg.media_id = ?
       ORDER BY g.id`,
      [row.media_id],
    );

    row.genre = genres.map((genre) => genre.name);

    // Ambil episode hanya untuk serial
    if (row.media_type === "series") {
      const [episodes] = await db.execute(
        `SELECT
        id AS episode_id,
        episode_number,
        title,
        description,
        CASE
          WHEN duration IS NULL THEN NULL
          ELSE CONCAT(duration, ' min')
        END AS duration,
        cover_url AS thumbnail,
        video_url
     FROM episodes_new
     WHERE series_id = ?
     ORDER BY episode_number`,
        [row.media_id],
      );

      row.episodes = episodes;
      row.video_url = null;
      row.recommendation_movie_1 = null;
    } else {
      row.episodes = null;

      // Ambil rekomendasi film berdasarkan urutan
      const [recommendations] = await db.execute(
        `SELECT recommended_movie_id
         FROM movie_recommendations_new
         WHERE movie_id = ?
         ORDER BY position`,
        [row.media_id],
      );

      row.recommendation_movie_1 = recommendations.map(
        (recommendation) => recommendation.recommended_movie_id,
      );
    }
  }

  return rows;
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
       AND media_id = ?`,
    [userId, mediaId],
  );

  return result.affectedRows;
};

module.exports = {
  getMyListByUserId,
  addToMyList,
  checkMediaExists,
  removeFromMyList,
};
