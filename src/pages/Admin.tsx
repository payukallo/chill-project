import { useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  description: string | null;
  rating: number;
  year: number | null;
  duration: string | null;
  cover_url: string | null;
  video_url: string | null;
  genre: string[] | null;
  is_premium: number | boolean;
  is_top_10: number | boolean;
  is_top_rating_today: number | boolean;
  film_maker: string | null;
  age_rating: string | null;
  cast_members: string | null;
  banner_url: string | null;
  type: number | null;
  recommendation_movie_1: number[] | null;
  is_new_episode: number | boolean;
}

function EditMovieSeries() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State informasi film
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("4.0");
  const [year, setYear] = useState("2026");
  const [duration, setDuration] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [genre, setGenre] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [isTop10, setIsTop10] = useState(false);
  const [isTopRatingToday, setIsTopRatingToday] = useState(false);
  const [filmMaker, setFilmMaker] = useState("");
  const [ageRating, setAgeRating] = useState("");
  const [castMembers, setCastMembers] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [type, setType] = useState("");
  const [recommendationMovie, setRecommendationMovie] = useState("");
  const [isNewEpisode, setIsNewEpisode] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);

  // Fungsi lainnya...

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRating("4.0");
    setYear("2026");
    setDuration("");
    setCoverUrl("");
    setVideoUrl("");
    setGenre("");
    setIsPremium(false);
    setIsTop10(false);
    setIsTopRatingToday(false);
    setFilmMaker("");
    setAgeRating("");
    setCastMembers("");
    setBannerUrl("");
    setType("");
    setRecommendationMovie("");
    setIsNewEpisode(false);
    setEditingId(null);
  };

  const handleEditClick = (movie: Movie) => {
    setEditingId(movie.id);

    setTitle(movie.title);
    setDescription(movie.description ?? "");
    setRating(String(movie.rating));
    setYear(movie.year !== null ? String(movie.year) : "");
    setDuration(movie.duration ?? "");
    setCoverUrl(movie.cover_url ?? "");
    setVideoUrl(movie.video_url ?? "");

    setGenre(Array.isArray(movie.genre) ? movie.genre.join(", ") : "");

    setIsPremium(Boolean(movie.is_premium));
    setIsTop10(Boolean(movie.is_top_10));
    setIsTopRatingToday(Boolean(movie.is_top_rating_today));

    setFilmMaker(movie.film_maker ?? "");
    setAgeRating(movie.age_rating ?? "");
    setCastMembers(movie.cast_members ?? "");
    setBannerUrl(movie.banner_url ?? "");
    setType(movie.type !== null ? String(movie.type) : "");

    setRecommendationMovie(
      movie.recommendation_movie_1
        ? JSON.stringify(movie.recommendation_movie_1)
        : "",
    );

    setIsNewEpisode(Boolean(movie.is_new_episode));
  };

  const handleUpdateMovie = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingId === null) return;

    try {
      const token = localStorage.getItem("token");

      const movieData = {
        title,
        description,
        rating: Number(rating),
        year: year ? Number(year) : null,
        duration,
        cover_url: coverUrl,
        video_url: videoUrl,
        genre: genre
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        is_premium: isPremium,
        is_top_10: isTop10,
        is_top_rating_today: isTopRatingToday,
        film_maker: filmMaker,
        age_rating: ageRating,
        cast_members: castMembers,
        banner_url: bannerUrl,
        type: type ? Number(type) : null,
        recommendation_movie_1: recommendationMovie.trim()
          ? JSON.parse(recommendationMovie)
          : null,
        is_new_episode: isNewEpisode,
      };

      const response = await fetch(
        `http://localhost:5000/api/movies/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(movieData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // Memuat ulang daftar film dari MySQL
      const moviesResponse = await fetch("http://localhost:5000/api/movies");

      if (!moviesResponse.ok) {
        throw new Error("Gagal memuat ulang daftar film");
      }

      const updatedMovies = await moviesResponse.json();
      setMovies(updatedMovies);

      resetForm();

      alert("Film berhasil diperbarui!");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof SyntaxError
          ? "Format JSON rekomendasi film tidak valid"
          : error instanceof Error
            ? error.message
            : "Gagal memperbarui film",
      );
    }
  };

  const handleDeleteMovie = async (id: number) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus film ini?",
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/movies/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMovies((currentMovies) =>
        currentMovies.filter((movie) => movie.id !== id),
      );

      alert("Film berhasil dihapus!");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus film");
    }
  };

  const handleAddMovie = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const movieData = {
        title,
        description,
        rating: Number(rating),
        year: year ? Number(year) : null,
        duration,
        cover_url: coverUrl,
        video_url: videoUrl,
        genre: genre
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        is_premium: isPremium,
        is_top_10: isTop10,
        is_top_rating_today: isTopRatingToday,
        film_maker: filmMaker,
        age_rating: ageRating,
        cast_members: castMembers,
        banner_url: bannerUrl,
        type: type ? Number(type) : null,
        recommendation_movie_1: recommendationMovie.trim()
          ? JSON.parse(recommendationMovie)
          : null,
        is_new_episode: isNewEpisode,
      };

      const response = await fetch("http://localhost:5000/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movieData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // Memuat ulang daftar film dari MySQL
      const moviesResponse = await fetch("http://localhost:5000/api/movies");

      if (!moviesResponse.ok) {
        throw new Error("Gagal memuat ulang daftar film");
      }

      const updatedMovies = await moviesResponse.json();
      setMovies(updatedMovies);

      resetForm();

      alert("Film berhasil ditambahkan!");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof SyntaxError
          ? "Format JSON rekomendasi film tidak valid"
          : error instanceof Error
            ? error.message
            : "Gagal menambahkan film",
      );
    }
  };

  useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/movies");

        if (!response.ok) {
          throw new Error("Gagal mengambil data film");
        }

        const data = await response.json();

        setMovies(data);
      } catch (error) {
        setError("Tidak dapat mengambil data dari MySQL");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, []);

  if (loading) {
    return <p>Memuat data film...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="test-api">
      <h1>Movies dari MySQL</h1>
      <form onSubmit={editingId !== null ? handleUpdateMovie : handleAddMovie}>
        <h2>{editingId !== null ? "Edit Film" : "Tambah Film"}</h2>

        {/* Informasi dasar */}
        <input
          type="text"
          placeholder="Judul film"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Deskripsi film"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Rating (0-5)"
          min="0"
          max="5"
          step="0.1"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Tahun film"
          min="1888"
          max="2026"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <input
          type="text"
          placeholder="Durasi (contoh: 120 min)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <input
          type="text"
          placeholder="Genre (pisahkan dengan koma)"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />

        {/* Gambar dan video */}
        <input
          type="text"
          placeholder="URL Cover / Poster"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="URL Banner"
          value={bannerUrl}
          onChange={(e) => setBannerUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="URL Video"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />

        {/* Informasi tambahan */}
        <input
          type="text"
          placeholder="Nama sutradara"
          value={filmMaker}
          onChange={(e) => setFilmMaker(e.target.value)}
        />

        <input
          type="text"
          placeholder="Batas usia (contoh: 13+)"
          value={ageRating}
          onChange={(e) => setAgeRating(e.target.value)}
        />

        <input
          type="text"
          placeholder="Daftar pemeran"
          value={castMembers}
          onChange={(e) => setCastMembers(e.target.value)}
        />

        <input
          type="number"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />

        {/* Status film */}
        <label>
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
          />
          Film Premium
        </label>

        <label>
          <input
            type="checkbox"
            checked={isTop10}
            onChange={(e) => setIsTop10(e.target.checked)}
          />
          Top 10
        </label>

        <label>
          <input
            type="checkbox"
            checked={isTopRatingToday}
            onChange={(e) => setIsTopRatingToday(e.target.checked)}
          />
          Top Rating Today
        </label>

        <label>
          <input
            type="checkbox"
            checked={isNewEpisode}
            onChange={(e) => setIsNewEpisode(e.target.checked)}
          />
          Episode Baru
        </label>

        {/* Rekomendasi film */}
        <textarea
          placeholder="Rekomendasi film dalam format JSON (opsional)"
          value={recommendationMovie}
          onChange={(e) => setRecommendationMovie(e.target.value)}
        />

        <button type="submit">
          {editingId !== null ? "Simpan Perubahan" : "Tambahkan Film"}
        </button>

        {editingId !== null && (
          <button type="button" onClick={resetForm}>
            Batal
          </button>
        )}
      </form>

      {movies.map((movie) => (
        <div key={movie.id}>
          <h3>{movie.title}</h3>
          <p>Rating: {movie.rating}</p>
          <p>Tahun: {movie.year}</p>
          <button onClick={() => handleEditClick(movie)}>Edit</button>
          <button onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default EditMovieSeries;
