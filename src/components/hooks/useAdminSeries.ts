import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { IAdminSeries, IAdminSeriesPayload } from "../type/IAdminSeries";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

import {
  getAllAdminSeries,
  getAdminSeriesById,
  createAdminSeries,
  updateAdminSeries,
  deleteAdminSeries,
} from "../../services/adminSeriesService";

// FORM EPISODE
export interface IAdminEpisodeForm {
  episode_number: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  video_url: string;
}

// FORM SERIES
export interface IAdminSeriesForm {
  id: number | null;
  title: string;
  description: string;
  rating: string;
  year: string;
  coverUrl: string;
  bannerUrl: string;
  genre: string;
  isPremium: boolean;
  isTop10: boolean;
  isTopRatingToday: boolean;
  filmMaker: string;
  ageRating: string;
  castMembers: string;
  isNewEpisode: boolean;
  episodes: IAdminEpisodeForm[];
}

// NILAI AWAL
const initialForm: IAdminSeriesForm = {
  id: null,
  title: "",
  description: "",
  rating: "4.0",
  year: "2026",
  coverUrl: "",
  bannerUrl: "",
  genre: "",
  isPremium: false,
  isTop10: false,
  isTopRatingToday: false,
  filmMaker: "",
  ageRating: "",
  castMembers: "",
  isNewEpisode: false,
  episodes: [],
};

export function useAdminSeries() {
  const [series, setSeries] = useState<IAdminSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<IAdminSeriesForm>({
    ...initialForm,
    episodes: [],
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  // MENGUBAH FIELD SERIES
  const updateField = <K extends keyof IAdminSeriesForm>(
    field: K,
    value: IAdminSeriesForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // RESET FORM
  const resetForm = () => {
    setForm({
      ...initialForm,
      episodes: [],
    });

    setEditingId(null);
  };

  // GET: SEMUA SERIES
  useEffect(() => {
    let active = true;

    const fetchSeries = async () => {
      try {
        const data = await getAllAdminSeries();

        if (active) {
          setSeries(data);
        }
      } catch (err) {
        console.error("Gagal mengambil Series:", err);

        if (active) {
          setError("Tidak dapat mengambil data Series");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchSeries();

    return () => {
      active = false;
    };
  }, []);

  // GET: SERIES BERDASARKAN ID
  const handleEditClick = async (item: IAdminSeries) => {
    try {
      const detail = await getAdminSeriesById(item.id);

      setForm({
        id: detail.id,
        title: detail.title,
        description: detail.description ?? "",
        rating: String(detail.rating),
        year: detail.year != null ? String(detail.year) : "",
        coverUrl: detail.cover_url ?? "",
        bannerUrl: detail.banner_url ?? "",
        genre: detail.genre.join(", "),
        isPremium: Boolean(detail.is_premium),
        isTop10: Boolean(detail.is_top_10),
        isTopRatingToday: Boolean(detail.is_top_rating_today),
        filmMaker: detail.film_maker ?? "",
        ageRating: detail.age_rating ?? "",
        castMembers: detail.cast_members ?? "",
        isNewEpisode: Boolean(detail.is_new_episode),

        episodes: detail.episodes.map((episode) => ({
          episode_number: episode.episode_number,
          title: episode.title,
          description: episode.description ?? "",
          duration: episode.duration ?? "",
          thumbnail: episode.thumbnail ?? "",
          video_url: episode.video_url ?? "",
        })),
      });

      setEditingId(detail.id);
    } catch (err) {
      console.error("Gagal mengambil detail Series:", err);

      alert(getApiErrorMessage(err, "Gagal mengambil detail Series"));
    }
  };

  // MENAMBAHKAN EPISODE KE FORM
  const addEpisode = () => {
    setForm((current) => {
      const nextNumber =
        Math.max(
          0,
          ...current.episodes.map((episode) => episode.episode_number),
        ) + 1;

      return {
        ...current,
        episodes: [
          ...current.episodes,
          {
            episode_number: nextNumber,
            title: "",
            description: "",
            duration: "",
            thumbnail: "",
            video_url: "",
          },
        ],
      };
    });
  };

  // MEMPERBARUI FIELD EPISODE
  const updateEpisode = <K extends keyof IAdminEpisodeForm>(
    index: number,
    field: K,
    value: IAdminEpisodeForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      episodes: current.episodes.map((episode, i) =>
        i === index ? { ...episode, [field]: value } : episode,
      ),
    }));
  };

  // MENGHAPUS EPISODE DARI FORM
  const removeEpisode = (index: number) => {
    // Pada mode edit, penghapusan episode yang sudah
    // tersimpan membutuhkan endpoint DELETE khusus.
    if (editingId !== null) {
      alert(
        "Penghapusan episode yang sudah tersimpan belum didukung. Gunakan Edit untuk memperbarui episode.",
      );
      return;
    }

    setForm((current) => ({
      ...current,
      episodes: current.episodes.filter((_, i) => i !== index),
    }));
  };

  // MENYIAPKAN DATA POST / PUT
  const buildSeriesData = (): IAdminSeriesPayload => ({
    title: form.title.trim(),
    description: form.description,
    rating: Number(form.rating),
    year: form.year ? Number(form.year) : null,
    cover_url: form.coverUrl,
    banner_url: form.bannerUrl,

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
    is_new_episode: form.isNewEpisode,

    episodes: form.episodes.map((episode) => ({
      episode_number: Number(episode.episode_number),
      title: episode.title.trim(),
      description: episode.description.trim(),
      duration: episode.duration.trim() || null,
      thumbnail: episode.thumbnail.trim() || null,
      video_url: episode.video_url.trim() || null,
    })),
  });

  // POST / PUT: MENYIMPAN SERIES
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);

    try {
      const data = buildSeriesData();

      if (!data.title) {
        throw new Error("Judul Series wajib diisi");
      }

      const episodeNumbers = data.episodes.map(
        (episode) => episode.episode_number,
      );

      if (
        data.episodes.some((episode) => {
          if (episode.duration === null) return false;

          const duration = Number.parseInt(episode.duration, 10);

          return !Number.isInteger(duration) || duration <= 0;
        })
      ) {
        throw new Error("Durasi episode harus berupa angka menit positif");
      }

      if (new Set(episodeNumbers).size !== episodeNumbers.length) {
        throw new Error("Nomor episode tidak boleh duplikat");
      }

      if (
        data.episodes.some(
          (episode) =>
            !Number.isInteger(episode.episode_number) ||
            episode.episode_number <= 0 ||
            !episode.title,
        )
      ) {
        throw new Error(
          "Setiap episode harus memiliki nomor positif dan judul",
        );
      }

      if (editingId !== null) {
        // PUT: MEMPERBARUI SERIES
        await updateAdminSeries(editingId, data);
      } else {
        // POST: MENAMBAHKAN SERIES
        await createAdminSeries(data);
      }

      // REFRESH DAFTAR SERIES
      const updatedSeries = await getAllAdminSeries();
      setSeries(updatedSeries);

      const wasEditing = editingId !== null;

      resetForm();

      alert(
        wasEditing
          ? "Series berhasil diperbarui!"
          : "Series berhasil ditambahkan!",
      );
    } catch (err) {
      console.error("Gagal menyimpan Series:", err);

      alert(getApiErrorMessage(err, "Gagal menyimpan Series"));
    } finally {
      setSaving(false);
    }
  };

  // DELETE: MENGHAPUS SERIES
  const handleDeleteSeries = async (id: number) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus Series ini?",
    );

    if (!confirmed) return;

    try {
      await deleteAdminSeries(id);

      setSeries((current) => current.filter((item) => item.id !== id));

      if (editingId === id) {
        resetForm();
      }

      alert("Series berhasil dihapus!");
    } catch (err) {
      console.error("Gagal menghapus Series:", err);

      alert(getApiErrorMessage(err, "Gagal menghapus Series"));
    }
  };

  return {
    series,
    loading,
    saving,
    error,
    form,
    editingId,
    updateField,
    resetForm,
    handleEditClick,
    handleSubmit,
    handleDeleteSeries,
    addEpisode,
    updateEpisode,
    removeEpisode,
  };
}
