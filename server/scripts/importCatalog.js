const db = require("../db");
const supabase = require("../config/supabase");

// Mengubah rating Supabase menjadi angka untuk MySQL
const parseRating = (rating) => {
  if (rating === null || rating === undefined) return null;

  const match = String(rating).match(/\d+(\.\d+)?/);

  return match ? Number(match[0]) : null;
};

// Mengubah nilai boolean menjadi 0 atau 1
const toBoolean = (value) => {
  return value === true || value === 1 || value === "true" ? 1 : 0;
};

// Mengubah data menjadi JSON untuk MySQL
const toJson = (value) => {
  return value == null ? null : JSON.stringify(value);
};

// Memeriksa dan menyiapkan data
const prepareData = (row, tableName) => {
  const data = row.data;

  const id = Number(row.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error(`ID ${tableName} tidak valid: ${row.id}`);
  }

  if (Number(data.id) !== id) {
    throw new Error(`ID Supabase dan data.id tidak cocok: ${row.id}`);
  }

  return {
    id,
    title: data.title,
    description: data.description ?? null,
    rating: parseRating(data.rating),
    year: data.year ?? null,
    duration: data.duration ?? null,
    cover_url: data.cover_url ?? null,
    banner_url: data.banner_url ?? null,
    genre: toJson(data.genre),
    is_premium: toBoolean(data.is_premium),
    is_top_10: toBoolean(data.is_top_10),
    is_top_rating_today: toBoolean(data.top_rating_today),
    film_maker: data.film_maker ?? null,
    age_rating: data.age ?? null,
    cast_members: data.cast ?? null,
    is_new_episode: toBoolean(data.is_new_episode),
    type: data.type ?? null,
  };
};

// Mengambil data Movie dari Supabase
const fetchMovies = async () => {
  const { data, error } = await supabase
    .from("movies")
    .select("id, data, video_url")
    .order("id");

  if (error) throw error;

  return data;
};

// Mengambil data Series dari Supabase
const fetchSeries = async () => {
  const { data, error } = await supabase
    .from("series")
    .select("id, data")
    .order("id");

  if (error) throw error;

  return data;
};

// Memasukkan Movie ke MySQL
const importMovies = async (connection, movies) => {
  const sql = `
    INSERT INTO movies (
      id, title, description, rating, year, duration,
      cover_url, video_url, banner_url, genre,
      is_premium, is_top_10, is_top_rating_today,
      film_maker, age_rating, cast_members,
      is_new_episode, type, recommendation_movie_1
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const row of movies) {
    const movie = prepareData(row, "movies");

    await connection.execute(sql, [
      movie.id,
      movie.title,
      movie.description,
      movie.rating,
      movie.year,
      movie.duration,
      movie.cover_url,
      row.video_url ?? null,
      movie.banner_url,
      movie.genre,
      movie.is_premium,
      movie.is_top_10,
      movie.is_top_rating_today,
      movie.film_maker,
      movie.age_rating,
      movie.cast_members,
      movie.is_new_episode,
      movie.type,
      toJson(row.data.recommendation_movie_1),
    ]);
  }
};

// Memasukkan Series ke MySQL
const importSeries = async (connection, series) => {
  const sql = `
    INSERT INTO series (
      id, title, description, rating, year,
      cover_url, genre, is_premium, is_top_10,
      is_top_rating_today, film_maker, age_rating,
      cast_members, is_new_episode, banner_url,
      duration, type, episodes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const row of series) {
    const item = prepareData(row, "series");

    await connection.execute(sql, [
      item.id,
      item.title,
      item.description,
      item.rating,
      item.year,
      item.cover_url,
      item.genre,
      item.is_premium,
      item.is_top_10,
      item.is_top_rating_today,
      item.film_maker,
      item.age_rating,
      item.cast_members,
      item.is_new_episode,
      item.banner_url,
      item.duration,
      item.type,
      toJson(row.data.episodes),
    ]);
  }
};

// Proses utama migrasi
const runImport = async () => {
  const connection = await db.getConnection();

  try {
    console.log("Mengambil data dari Supabase...");

    const movies = await fetchMovies();
    const series = await fetchSeries();

    console.log(`Movie ditemukan: ${movies.length}`);
    console.log(`Series ditemukan: ${series.length}`);

    if (movies.length === 0 || series.length === 0) {
      throw new Error("Data Movie atau Series dari Supabase kosong.");
    }

    console.log("Memulai transaksi MySQL...");

    await connection.beginTransaction();

    // Pastikan tabel MySQL masih kosong
    const [movieCount] = await connection.query(
      "SELECT COUNT(*) AS total FROM movies",
    );

    const [seriesCount] = await connection.query(
      "SELECT COUNT(*) AS total FROM series",
    );

    if (movieCount[0].total !== 0 || seriesCount[0].total !== 0) {
      throw new Error(
        "Tabel movies atau series tidak kosong. Impor dibatalkan.",
      );
    }

    console.log("Memindahkan Movie...");
    await importMovies(connection, movies);

    console.log("Memindahkan Series...");
    await importSeries(connection, series);

    await connection.commit();

    console.log("================================");
    console.log("MIGRASI BERHASIL!");
    console.log(`Total Movie: ${movies.length}`);
    console.log(`Total Series: ${series.length}`);
    console.log("================================");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

runImport()
  .catch((error) => {
    console.error("Migrasi gagal:", error.message);
  })
  .finally(async () => {
    await db.end();
  });
