import type { FormEvent } from "react";
import type {
  IAdminSeriesForm,
  IAdminEpisodeForm,
} from "../hooks/useAdminSeries";

interface SeriesFormProps {
  form: IAdminSeriesForm;
  editingId: number | null;
  saving: boolean;

  updateField: <K extends keyof IAdminSeriesForm>(
    field: K,
    value: IAdminSeriesForm[K],
  ) => void;

  updateEpisode: <K extends keyof IAdminEpisodeForm>(
    index: number,
    field: K,
    value: IAdminEpisodeForm[K],
  ) => void;

  addEpisode: () => void;
  removeEpisode: (index: number) => void;

  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
}

export function SeriesForm({
  form,
  editingId,
  saving,
  updateField,
  updateEpisode,
  addEpisode,
  removeEpisode,
  handleSubmit,
  resetForm,
}: SeriesFormProps) {
  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{editingId !== null ? "Edit Series" : "Tambah Series"}</h2>

      {/* INFORMASI DASAR */}
      <span>ID Series : {form.id}</span>
      <label htmlFor="title">Judul Series</label>
      <input
        id="title"
        type="text"
        placeholder="Judul film"
        value={form.title}
        onChange={(e) => updateField("title", e.target.value)}
        required
      />
      <label htmlFor="description">Deskripsi Series</label>
      <textarea
        id="description"
        placeholder="Deskripsi film"
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
      />
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
      <label htmlFor="year-release">Tahun Series</label>
      <input
        id="year-release"
        type="number"
        placeholder="Tahun film"
        min="1888"
        max="2026"
        value={form.year}
        onChange={(e) => updateField("year", e.target.value)}
      />

      <label htmlFor="genre">Genre Series</label>
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

      {/* STATUS SERIES */}

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

        <label>
          <input
            type="checkbox"
            checked={form.isNewEpisode}
            onChange={(e) => updateField("isNewEpisode", e.target.checked)}
          />
          Episode Baru
        </label>
      </div>

      {/* DAFTAR EPISODE */}

      <div className="admin-series-episodes">
        <h3>Daftar Episode</h3>

        {form.episodes.length === 0 && (
          <p>Belum ada episode yang ditambahkan.</p>
        )}

        {form.episodes.map((episode, index) => (
          <div key={index} className="admin-series-episode-item">
            <h4>Episode {episode.episode_number}</h4>

            <label htmlFor="episode-title"></label>
            <input
              id="episode-title"
              type="text"
              placeholder="Judul Episode"
              value={episode.title}
              onChange={(e) => updateEpisode(index, "title", e.target.value)}
              required
            />
            <label htmlFor="episode-description">Deskripsi Episode</label>
            <textarea
              id="episode-description"
              placeholder="Deskripsi Episode"
              value={episode.description}
              onChange={(e) =>
                updateEpisode(index, "description", e.target.value)
              }
            />
            <label htmlFor="episode-duration">Durasi Episode</label>
            <input
              id="episode-duration"
              type="text"
              placeholder="Durasi (contoh: 48 min)"
              value={episode.duration}
              onChange={(e) => updateEpisode(index, "duration", e.target.value)}
            />
            <label htmlFor="episode-thumbnail-url">URL Thumbnail Episode</label>
            <input
              id="episode-thumbnail-url"
              type="text"
              placeholder="URL Thumbnail Episode"
              value={episode.thumbnail}
              onChange={(e) =>
                updateEpisode(index, "thumbnail", e.target.value)
              }
            />
            <label htmlFor="episode-video-url">URL Video Episode</label>
            <input
              id="episode-video-url"
              type="text"
              placeholder="URL Video Episode"
              value={episode.video_url}
              onChange={(e) =>
                updateEpisode(index, "video_url", e.target.value)
              }
            />

            <button
              type="button"
              onClick={() => removeEpisode(index)}
              disabled={saving || editingId !== null}
              title={
                editingId !== null
                  ? "Penghapusan episode tersimpan belum didukung"
                  : "Hapus episode dari form"
              }
            >
              Hapus Episode
            </button>
          </div>
        ))}

        <button type="button" onClick={addEpisode} disabled={saving}>
          + Tambah Episode
        </button>

        {editingId !== null && (
          <p>
            Episode yang sudah tersimpan dapat diperbarui. Penghapusan episode
            belum tersedia.
          </p>
        )}
      </div>

      {/* TOMBOL AKSI */}

      <div className="admin-series-actions">
        <button type="submit" disabled={saving}>
          {saving
            ? "Menyimpan..."
            : editingId !== null
              ? "Simpan Perubahan"
              : "Tambahkan Series"}
        </button>

        {editingId !== null && (
          <button type="button" onClick={resetForm} disabled={saving}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
