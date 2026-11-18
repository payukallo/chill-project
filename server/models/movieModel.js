
const db = require("../db");

// Mengubah durasi teks menjadi angka menit
const parseDuration = (duration) => {
  if (duration === null || duration === undefined || duration === "") {
    return null;
  }

  const minutes = Number.parseInt(String(duration), 10);

  if (!Number.isInteger(minutes) || minutes <= 0) {
    throw new Error("Durasi film harus berupa angka menit yang valid");
  }

  return minutes;
};

// Mengambil genre berdasarkan media ID
const getGenres = async (connection, mediaId) => {
  const [rows] = await connection.execute(
    `SELECT g.name
     FROM media_genres mg
     JOIN genres g ON mg.genre_id = g.id
     WHERE mg.media_id = ?
     ORDER BY g.name`,
    [mediaId],
  );

  return rows.map((row) => row.name);
};

// Mengambil rekomendasi film
const getRecommendations = async (connection, movieId) => {
  const [rows] = await connection.execute(
    `SELECT recommended_movie_id
     FROM movie_recommendations_new
     WHERE movie_id = ?
     ORDER BY position`,
    [movieId],
  );

  return rows.map((row) => row.recommended_movie_id);
};

// Menyimpan genre
const saveGenres = async (connection, mediaId, genres) => {
  for (const genre of genres ?? []) {
    const [result] = await connection.execute(
      `INSERT INTO genres (name)
       VALUES (?)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [genre.trim()],
    );

    await connection.execute(
      `INSERT IGNORE INTO media_genres (media_id, genre_id)
       VALUES (?, ?)`,
      [mediaId, result.insertId],
    );
  }
};

// Menyimpan rekomendasi
const saveRecommendations = async (
  connection,
  movieId,
  recommendations,
) => {
  if (!Array.isArray(recommendations)) {
    throw new Error("Rekomendasi harus berupa array ID film");
  }

  if (recommendations.length > 3) {
    throw new Error("Maksimal tiga rekomendasi film");
  }

  const uniqueRecommendations = [...new Set(recommendations)];

  if (uniqueRecommendations.length !== recommendations.length) {
    throw new Error("Rekomendasi tidak boleh duplikat");
  }

  for (let index = 0; index < recommendations.length; index++) {
    await connection.execute(
      `INSERT INTO movie_recommendations_new
       (movie_id, recommended_movie_id, position)
       VALUES (?, ?, ?)`,
      [movieId, recommendations[index], index + 1],
    );
  }
};

// Mengambil semua film
const getAllMovies = async () => {
  const connection = await db.getConnection();

  try {
    const [movies] = await connection.execute(
      `SELECT
          m.id,
          m.title,
          m.description,
          m.rating,
          m.year,
          m.cover_url,
          m.banner_url,
          m.is_premium,
          m.is_top_10,
          m.is_top_rating_today,
          m.film_maker,
          m.age_rating,
          m.cast_members,
          m.is_new_episode,
          mn.duration_minutes,
          mn.video_url
       FROM media_new m
       JOIN movies_new mn ON m.id = mn.media_id
       WHERE m.media_type = 'movie'
       ORDER BY m.id`,
    );

    for (const movie of movies) {
      movie.duration = movie.duration_minutes
        ? `${movie.duration_minutes} min`
        : null;

      delete movie.duration_minutes;

      movie.genre = await getGenres(connection, movie.id);

      movie.recommendation_movie_1 = await getRecommendations(
        connection,
        movie.id,
      );
    }

    return movies;
  } finally {
    connection.release();
  }
};

// Menambahkan film baru
const createMovie = async (movie) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const durationMinutes = parseDuration(movie.duration);

    const [mediaResult] = await connection.execute(
      `INSERT INTO media_new (
          title,
          description,
          media_type,
          rating,
          year,
          cover_url,
          banner_url,
          is_premium,
          is_top_10,
          is_top_rating_today,
          film_maker,
          age_rating,
          cast_members,
          is_new_episode
       ) VALUES (?, ?, 'movie', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        movie.title,
        movie.description ?? null,
        movie.rating ?? 0,
        movie.year ?? null,
        movie.cover_url ?? null,
        movie.banner_url ?? null,
        movie.is_premium ?? false,
        movie.is_top_10 ?? false,
        movie.is_top_rating_today ?? false,
        movie.film_maker ?? null,
        movie.age_rating ?? null,
        movie.cast_members ?? null,
        movie.is_new_episode ?? false,
      ],
    );

    const movieId = mediaResult.insertId;

    await connection.execute(
      `INSERT INTO movies_new (
          media_id,
          duration_minutes,
          video_url
       ) VALUES (?, ?, ?)`,
      [
        movieId,
        durationMinutes,
        movie.video_url ?? null,
      ],
    );

    await saveGenres(connection, movieId, movie.genre);

    await saveRecommendations(
      connection,
      movieId,
      movie.recommendation_movie_1 ?? [],
    );

    await connection.commit();

    return {
      insertId: movieId,
      affectedRows: 1,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Memperbarui film
const updateMovie = async (id, movie) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const durationMinutes = parseDuration(movie.duration);

    const [result] = await connection.execute(
      `UPDATE media_new
       SET
          title = ?,
          description = ?,
          rating = ?,
          year = ?,
          cover_url = ?,
          banner_url = ?,
          is_premium = ?,
          is_top_10 = ?,
          is_top_rating_today = ?,
          film_maker = ?,
          age_rating = ?,
          cast_members = ?,
          is_new_episode = ?
       WHERE id = ?
         AND media_type = 'movie'`,
      [
        movie.title,
        movie.description ?? null,
        movie.rating,
        movie.year ?? null,
        movie.cover_url ?? null,
        movie.banner_url ?? null,
        movie.is_premium ?? false,
        movie.is_top_10 ?? false,
        movie.is_top_rating_today ?? false,
        movie.film_maker ?? null,
        movie.age_rating ?? null,
        movie.cast_members ?? null,
        movie.is_new_episode ?? false,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      await connection.rollback();

      return {
        affectedRows: 0,
      };
    }

    await connection.execute(
      `UPDATE movies_new
       SET duration_minutes = ?, video_url = ?
       WHERE media_id = ?`,
      [
        durationMinutes,
        movie.video_url ?? null,
        id,
      ],
    );

    await connection.execute(
      "DELETE FROM media_genres WHERE media_id = ?",
      [id],
    );

    await saveGenres(connection, id, movie.genre);

    await connection.execute(
      "DELETE FROM movie_recommendations_new WHERE movie_id = ?",
      [id],
    );

    await saveRecommendations(
      connection,
      Number(id),
      movie.recommendation_movie_1 ?? [],
    );

    await connection.commit();

    return {
      affectedRows: 1,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Menghapus film
const deleteMovie = async (id) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Pastikan film tersedia
    const [movies] = await connection.execute(
      `SELECT id
       FROM media_new
       WHERE id = ? AND media_type = 'movie'
       FOR UPDATE`,
      [id],
    );

    if (movies.length === 0) {
      await connection.rollback();
      return { affectedRows: 0 };
    }

    // Cegah penghapusan film yang memiliki riwayat tontonan
    const [history] = await connection.execute(
      `SELECT id
       FROM watch_history
       WHERE media_id = ?
       LIMIT 1`,
      [id],
    );

    if (history.length > 0) {
      throw new Error(
        "Film tidak dapat dihapus karena memiliki riwayat tontonan"
      );
    }

    // Hapus film beserta relasi yang menggunakan ON DELETE CASCADE
    const [result] = await connection.execute(
      `DELETE FROM media_new
       WHERE id = ? AND media_type = 'movie'`,
      [id],
    );

    await connection.commit();

    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};


module.exports = {
  getAllMovies,
  createMovie,
  updateMovie,
  deleteMovie,
};
