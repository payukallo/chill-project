const db = require("../db");

// GET: Mengambil semua series

const getAllSeries = async () => {
  const connection = await db.getConnection();

  try {
    // Query 1: Semua serial
    const [seriesRows] = await connection.query(`
      SELECT m.*
      FROM media_new AS m
      INNER JOIN series_new AS s
        ON s.media_id = m.id
      WHERE m.media_type = 'series'
      ORDER BY m.id
    `);

    if (seriesRows.length === 0) {
      return [];
    }

    // Query 2: Semua genre serial
    const [genreRows] = await connection.query(`
      SELECT mg.media_id, g.name
      FROM media_genres AS mg
      INNER JOIN genres AS g
        ON g.id = mg.genre_id
      INNER JOIN series_new AS s
        ON s.media_id = mg.media_id
      ORDER BY mg.media_id, g.name
    `);

    // Query 3: Semua episode serial
    const [episodeRows] = await connection.query(`
      SELECT
        e.series_id,
        e.id AS episode_id,
        e.episode_number,
        e.title,
        e.description,
        e.duration,
        e.cover_url,
        e.video_url
      FROM episodes_new AS e
      INNER JOIN series_new AS s
        ON s.media_id = e.series_id
      ORDER BY e.series_id, e.episode_number
    `);

    const genresMap = new Map();
    const episodesMap = new Map();

    for (const row of genreRows) {
      if (!genresMap.has(row.media_id)) {
        genresMap.set(row.media_id, []);
      }

      genresMap.get(row.media_id).push(row.name);
    }

    for (const row of episodeRows) {
      if (!episodesMap.has(row.series_id)) {
        episodesMap.set(row.series_id, []);
      }

      episodesMap.get(row.series_id).push({
        episode_id: row.episode_id,
        episode_number: row.episode_number,
        title: row.title,
        description: row.description,
        duration: row.duration === null ? null : `${row.duration} min`,
        thumbnail: row.cover_url,
        video_url: row.video_url,
      });
    }

    return seriesRows.map((media) => {
      const episodes = episodesMap.get(media.id) ?? [];

      return {
        ...media,
        type: 1,
        genre: genresMap.get(media.id) ?? [],
        duration: `${episodes.length} Episodes`,
        episodes,
      };
    });
  } finally {
    connection.release();
  }
};

// POST: Menambahkan series ke database
const createSeries = async (data) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      title,
      description,
      rating,
      year,
      cover_url,
      banner_url,
      genre,
      is_premium,
      is_top_10,
      is_top_rating_today,
      film_maker,
      age_rating,
      cast_members,
      is_new_episode,
      episodes,
    } = data;

    // 1. Simpan informasi utama serial
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
      ) VALUES (?, ?, 'series', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        description ?? null,
        rating ?? 0,
        year ?? null,
        cover_url ?? null,
        banner_url ?? null,
        is_premium ?? 0,
        is_top_10 ?? 0,
        is_top_rating_today ?? 0,
        film_maker ?? null,
        age_rating ?? null,
        cast_members ?? null,
        is_new_episode ?? 0,
      ],
    );

    const seriesId = mediaResult.insertId;

    // 2. Simpan identitas serial
    await connection.execute(
      `INSERT INTO series_new (media_id)
       VALUES (?)`,
      [seriesId],
    );

    // 3. Simpan genre serial
    if (Array.isArray(genre)) {
      for (const genreName of genre) {
        const name = genreName.trim();

        if (!name) continue;

        const [genreResult] = await connection.execute(
          `INSERT INTO genres (name)
           VALUES (?)
           ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
          [name],
        );

        await connection.execute(
          `INSERT IGNORE INTO media_genres (
            media_id,
            genre_id
          ) VALUES (?, ?)`,
          [seriesId, genreResult.insertId],
        );
      }
    }

    // 4. Simpan episode jika tersedia
    if (Array.isArray(episodes)) {
      for (const episode of episodes) {
        const duration =
          episode.duration == null
            ? null
            : Number.parseInt(String(episode.duration), 10);

        if (duration !== null && !Number.isInteger(duration)) {
          throw new Error("Durasi episode tidak valid");
        }

        await connection.execute(
          `INSERT INTO episodes_new (
            series_id,
            episode_number,
            title,
            description,
            duration,
            cover_url,
            video_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            seriesId,
            episode.episode_number,
            episode.title,
            episode.description ?? null,
            duration,
            episode.thumbnail ?? episode.cover_url ?? null,
            episode.video_url ?? null,
          ],
        );
      }
    }

    await connection.commit();

    return seriesId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// PUT: Memperbarui series pada database
const updateSeries = async (id, data) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Pastikan ID merupakan serial yang tersedia
    const [existing] = await connection.execute(
      `SELECT id
       FROM media_new
       WHERE id = ? AND media_type = 'series'
       FOR UPDATE`,
      [id],
    );

    if (existing.length === 0) {
      await connection.rollback();
      return 0;
    }

    const {
      title,
      description,
      rating,
      year,
      cover_url,
      banner_url,
      genre,
      is_premium,
      is_top_10,
      is_top_rating_today,
      film_maker,
      age_rating,
      cast_members,
      is_new_episode,
      episodes,
    } = data;

    // 1. Perbarui informasi utama serial
    await connection.execute(
      `UPDATE media_new SET
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
       WHERE id = ? AND media_type = 'series'`,
      [
        title.trim(),
        description ?? null,
        rating ?? 0,
        year ?? null,
        cover_url ?? null,
        banner_url ?? null,
        is_premium ?? 0,
        is_top_10 ?? 0,
        is_top_rating_today ?? 0,
        film_maker ?? null,
        age_rating ?? null,
        cast_members ?? null,
        is_new_episode ?? 0,
        id,
      ],
    );

    // 2. Perbarui genre jika dikirim
    if (Array.isArray(genre)) {
      await connection.execute(`DELETE FROM media_genres WHERE media_id = ?`, [
        id,
      ]);

      for (const genreName of genre) {
        const name = genreName.trim();

        if (!name) continue;

        const [genreResult] = await connection.execute(
          `INSERT INTO genres (name)
           VALUES (?)
           ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
          [name],
        );

        await connection.execute(
          `INSERT IGNORE INTO media_genres (media_id, genre_id)
           VALUES (?, ?)`,
          [id, genreResult.insertId],
        );
      }
    }

    // 3. Tambahkan atau perbarui episode tanpa menghapus ID lama
    if (Array.isArray(episodes)) {
      for (const episode of episodes) {
        const duration =
          episode.duration == null
            ? null
            : Number.parseInt(String(episode.duration), 10);

        if (
          duration !== null &&
          (!Number.isInteger(duration) || duration < 0)
        ) {
          throw new Error("Durasi episode tidak valid");
        }

        await connection.execute(
          `INSERT INTO episodes_new (
        series_id,
        episode_number,
        title,
        description,
        duration,
        cover_url,
        video_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        duration = VALUES(duration),
        cover_url = VALUES(cover_url),
        video_url = VALUES(video_url)`,
          [
            id,
            episode.episode_number,
            episode.title,
            episode.description ?? null,
            duration,
            episode.thumbnail ?? episode.cover_url ?? null,
            episode.video_url ?? null,
          ],
        );
      }
    }

    await connection.commit();

    return 1;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// DELETE: Menghapus serial dari database
const deleteSeries = async (id) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Pastikan serial tersedia
    const [series] = await connection.execute(
      `SELECT id
       FROM media_new
       WHERE id = ? AND media_type = 'series'
       FOR UPDATE`,
      [id],
    );

    if (series.length === 0) {
      await connection.rollback();
      return 0;
    }

    // Cegah penghapusan jika sudah memiliki riwayat tontonan
    const [history] = await connection.execute(
      `SELECT id
       FROM watch_history
       WHERE media_id = ?
       LIMIT 1`,
      [id],
    );

    if (history.length > 0) {
      throw new Error(
        "Serial tidak dapat dihapus karena memiliki riwayat tontonan",
      );
    }

    // Hapus serial beserta data terkait melalui ON DELETE CASCADE
    const [result] = await connection.execute(
      `DELETE FROM media_new
       WHERE id = ? AND media_type = 'series'`,
      [id],
    );

    await connection.commit();

    return result.affectedRows;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllSeries,
  createSeries,
  updateSeries,
  deleteSeries,
};
