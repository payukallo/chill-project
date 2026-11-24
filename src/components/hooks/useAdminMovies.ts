import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { IAdminMovie } from "../type/IAdminMovie";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

import {
  getAllAdminMovies,
  getAdminMovieById,
  createAdminMovie,
  updateAdminMovie,
  deleteAdminMovie,
} from "../../services/adminMovieService";

// Struktur state form
export interface IAdminMovieForm {
  id: number | null;
  title: string;
  description: string;
  rating: string;
  year: string;
  duration: string;
  coverUrl: string;
  videoUrl: string;
  genre: string;
  isPremium: boolean;
  isTop10: boolean;
  isTopRatingToday: boolean;
  filmMaker: string;
  ageRating: string;
  castMembers: string;
  bannerUrl: string;
  recommendationMovie: string;
  isNewEpisode: boolean;
}

// Nilai awal form
const initialForm: IAdminMovieForm = {
  id: null,
  title: "",
  description: "",
  rating: "4.0",
  year: "2026",
  duration: "",
  coverUrl: "",
  videoUrl: "",
  genre: "",
  isPremium: false,
  isTop10: false,
  isTopRatingToday: false,
  filmMaker: "",
  ageRating: "",
  castMembers: "",
  bannerUrl: "",
  recommendationMovie: "",
  isNewEpisode: false,
};

export function useAdminMovies() {
  const [movies, setMovies] = useState<IAdminMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<IAdminMovieForm>({
    ...initialForm,
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  // Mengubah satu field form
  const updateField = <K extends keyof IAdminMovieForm>(
    field: K,
    value: IAdminMovieForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setForm({ ...initialForm });
    setEditingId(null);
  };

  // GET: Mengambil semua Movie
  useEffect(() => {
    let active = true;

    const fetchMovies = async () => {
      try {
        const data = await getAllAdminMovies();

        if (active) {
          setMovies(data);
        }
      } catch (err) {
        console.error("Gagal mengambil Movie:", err);

        if (active) {
          setError("Tidak dapat mengambil data dari MySQL");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchMovies();

    return () => {
      active = false;
    };
  }, []);

  // GET: Mengambil satu Movie berdasarkan ID
  const handleEditClick = async (movie: IAdminMovie) => {
    try {
      const movieDetail = await getAdminMovieById(movie.id);

      setForm({
        id: movieDetail.id,
        title: movieDetail.title,
        description: movieDetail.description ?? "",
        rating: String(movieDetail.rating),
        year: movieDetail.year !== null ? String(movieDetail.year) : "",
        duration: movieDetail.duration ?? "",
        coverUrl: movieDetail.cover_url ?? "",
        videoUrl: movieDetail.video_url ?? "",
        genre: Array.isArray(movieDetail.genre)
          ? movieDetail.genre.join(", ")
          : "",
        isPremium: Boolean(movieDetail.is_premium),
        isTop10: Boolean(movieDetail.is_top_10),
        isTopRatingToday: Boolean(movieDetail.is_top_rating_today),
        filmMaker: movieDetail.film_maker ?? "",
        ageRating: movieDetail.age_rating ?? "",
        castMembers: movieDetail.cast_members ?? "",
        bannerUrl: movieDetail.banner_url ?? "",
        recommendationMovie: movieDetail.recommendation_movie_1
          ? JSON.stringify(movieDetail.recommendation_movie_1)
          : "",
        isNewEpisode: Boolean(movieDetail.is_new_episode),
      });

      setEditingId(movieDetail.id);
    } catch (err) {
      console.error("Gagal mengambil detail Movie:", err);

      alert(getApiErrorMessage(err, "Gagal mengambil detail film"));
    }
  };

  // Menyiapkan data untuk POST / PUT
  const buildMovieData = () => ({
    title: form.title,
    description: form.description,
    rating: Number(form.rating),
    year: form.year ? Number(form.year) : null,
    duration: form.duration,
    cover_url: form.coverUrl,
    video_url: form.videoUrl,
    genre: form.genre
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    is_premium: form.isPremium,
    is_top_10: form.isTop10,
    is_top_rating_today: form.isTopRatingToday,
    film_maker: form.filmMaker,
    age_rating: form.ageRating,
    cast_members: form.castMembers,
    banner_url: form.bannerUrl,
    recommendation_movie_1: form.recommendationMovie.trim()
      ? JSON.parse(form.recommendationMovie)
      : [],
    is_new_episode: form.isNewEpisode,
  });

  // POST / PUT: Menyimpan Movie
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);

    try {
      const movieData = buildMovieData();

      if (editingId !== null) {
        // PUT: Memperbarui Movie
        await updateAdminMovie(editingId, movieData);
      } else {
        // POST: Menambahkan Movie
        await createAdminMovie(movieData);
      }

      // Memuat ulang daftar Movie
      const updatedMovies = await getAllAdminMovies();
      setMovies(updatedMovies);

      const wasEditing = editingId !== null;

      resetForm();

      alert(
        wasEditing ? "Film berhasil diperbarui!" : "Film berhasil ditambahkan!",
      );
    } catch (err) {
      console.error("Gagal menyimpan Movie:", err);

      alert(
        err instanceof SyntaxError
          ? "Format JSON rekomendasi film tidak valid"
          : getApiErrorMessage(err, "Gagal menyimpan film"),
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE: Menghapus Movie
  const handleDeleteMovie = async (id: number) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus film ini?",
    );

    if (!confirmed) return;

    try {
      await deleteAdminMovie(id);

      setMovies((current) => current.filter((movie) => movie.id !== id));

      if (editingId === id) {
        resetForm();
      }

      alert("Film berhasil dihapus!");
    } catch (err) {
      console.error("Gagal menghapus Movie:", err);

      alert(getApiErrorMessage(err, "Gagal menghapus film"));
    }
  };

  return {
    movies,
    loading,
    saving,
    error,
    form,
    editingId,
    updateField,
    resetForm,
    handleEditClick,
    handleSubmit,
    handleDeleteMovie,
  };
}
