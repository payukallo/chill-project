import type { FormEvent } from "react";
import type { IAdminMovieForm } from "../hooks/useAdminMovies";

interface MovieFormProps {
  form: IAdminMovieForm;
  editingId: number | null;
  saving: boolean;
  updateField: <K extends keyof IAdminMovieForm>(
    field: K,
    value: IAdminMovieForm[K],
  ) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
}

export function MovieForm({
  form,
  editingId,
  saving,
  updateField,
  handleSubmit,
  resetForm,
}: MovieFormProps) {
  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <p className="heading-3">
        {editingId !== null ? "Edit Film" : "Tambah Film"}
      </p>

      {/* INFORMASI DASAR */}

      <span>ID Film : {form.id}</span>
      <label htmlFor="title">Judul Film</label>
      <input
        id="title"
        type="text"
        placeholder="Judul film"
        value={form.title}
        onChange={(e) => updateField("title", e.target.value)}
        required
      />
      <label htmlFor="description">Deskripsi Film</label>
      <textarea
        id="description"
        placeholder="Deskripsi film"
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
      />
      <div className="form-rating-year-duration">
        <div>
          <label htmlFor="rating">Rating 0-5</label>
          <input
            id="rating"
            type="number"
            placeholder="Rating (0-5)"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={(e) => updateField("rating", e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="year-release">Tahun Film</label>
          <input
            id="year-release"
            type="number"
            placeholder="Tahun film"
            min="1888"
            max="2026"
            value={form.year}
            onChange={(e) => updateField("year", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="duration">Durasi Film</label>
          <input
            id="duration"
            type="text"
            placeholder="Durasi (contoh: 120 min)"
            value={form.duration}
            onChange={(e) => updateField("duration", e.target.value)}
          />
        </div>
      </div>
      <label htmlFor="genre">Genre Film</label>
      <input
        id="genre"
        type="text"
        placeholder="Genre (pisahkan dengan koma)"
        value={form.genre}
        onChange={(e) => updateField("genre", e.target.value)}
      />

      {/* GAMBAR DAN VIDEO */}
      <label htmlFor="url-cover">Link Gambar Poster</label>
      <input
        id="url-cover"
        type="text"
        placeholder="URL Cover / Poster"
        value={form.coverUrl}
        onChange={(e) => updateField("coverUrl", e.target.value)}
      />
      <label htmlFor="url-banner">Link Gambar Baner</label>
      <input
        id="url-banner"
        type="text"
        placeholder="URL Banner"
        value={form.bannerUrl}
        onChange={(e) => updateField("bannerUrl", e.target.value)}
      />
      <label htmlFor="url-video">Link Vidio</label>
      <input
        id="ulr-video"
        type="text"
        placeholder="URL Video"
        value={form.videoUrl}
        onChange={(e) => updateField("videoUrl", e.target.value)}
      />

      {/* INFORMASI TAMBAHAN */}
      <label htmlFor="film-maker">Nama Sutradara</label>
      <input
        id="fiom-maker"
        type="text"
        placeholder="Nama sutradara"
        value={form.filmMaker}
        onChange={(e) => updateField("filmMaker", e.target.value)}
      />
      <label htmlFor="age-rating">Rekomendasi Usia</label>
      <input
        id="age-rating"
        type="text"
        placeholder="Batas usia (contoh: 13+)"
        value={form.ageRating}
        onChange={(e) => updateField("ageRating", e.target.value)}
      />
      <label htmlFor="cast-member">Daftar pemeran</label>
      <input
        id="cast-member"
        type="text"
        placeholder="Daftar pemeran"
        value={form.castMembers}
        onChange={(e) => updateField("castMembers", e.target.value)}
      />

      {/* REKOMENDASI FILM */}
      <label htmlFor="movie-recommendation">Rekomendasi Film</label>
      <input
        id="movie-recommendation"
        type="text"
        placeholder="Rekomendasi film dalam format JSON [  ,  ,  ] "
        value={form.recommendationMovie}
        onChange={(e) => updateField("recommendationMovie", e.target.value)}
      />

      {/* STATUS FILM */}
      <div className="status-movie-series">
        <label>
          <input
            type="checkbox"
            checked={form.isPremium}
            onChange={(e) => updateField("isPremium", e.target.checked)}
          />
          Film Premium
        </label>

        <label>
          <input
            type="checkbox"
            checked={form.isTop10}
            onChange={(e) => updateField("isTop10", e.target.checked)}
          />
          Top 10
        </label>

        <label>
          <input
            type="checkbox"
            checked={form.isTopRatingToday}
            onChange={(e) => updateField("isTopRatingToday", e.target.checked)}
          />
          Top Rating Today
        </label>
      </div>

      {/* TOMBOL AKSI */}

      <button type="submit" disabled={saving}>
        {saving
          ? "Menyimpan..."
          : editingId !== null
            ? "Simpan Perubahan"
            : "Tambahkan Film"}
      </button>

      {editingId !== null && (
        <button type="button" onClick={resetForm} disabled={saving}>
          Batal
        </button>
      )}
    </form>
  );
}
