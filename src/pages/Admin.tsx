import "../assets/styles/admin.css";
import { useState } from "react";
import { MovieForm } from "../components/admin/MovieForm";
import { MovieList } from "../components/admin/MovieList";
import { SeriesForm } from "../components/admin/SeriesForm";
import { SeriesList } from "../components/admin/SeriesList";
import { useAdminMovies } from "../components/hooks/useAdminMovies";
import { useAdminSeries } from "../components/hooks/useAdminSeries";
import { Navbar } from "../layouts/Navbar";

type AdminTab = "movie" | "series";

export default function EditMovieSeries() {
  const [activeTab, setActiveTab] = useState<AdminTab>("movie");

  const movieAdmin = useAdminMovies();
  const seriesAdmin = useAdminSeries();

  return (
    <div className="admin-page">
      <Navbar />
      <p className="heading-2">Kelola Film dan Series</p>

      {/* PILIHAN TAB */}
      <div className="admin-tabs">
        <button
          type="button"
          className={activeTab === "movie" ? "active" : ""}
          onClick={() => setActiveTab("movie")}
          aria-pressed={activeTab === "movie"}
        >
          Film
        </button>

        <button
          type="button"
          className={activeTab === "series" ? "active" : ""}
          onClick={() => setActiveTab("series")}
          aria-pressed={activeTab === "series"}
        >
          Series
        </button>
      </div>

      {/* CRUD MOVIE */}
      {activeTab === "movie" && (
        <section className="admin-section">
          <p className="heading-3">Kelola Film</p>

          {movieAdmin.loading ? (
            <p>Memuat data film...</p>
          ) : movieAdmin.error ? (
            <p>{movieAdmin.error}</p>
          ) : (
            <>
              <MovieForm
                form={movieAdmin.form}
                editingId={movieAdmin.editingId}
                saving={movieAdmin.saving}
                updateField={movieAdmin.updateField}
                handleSubmit={movieAdmin.handleSubmit}
                resetForm={movieAdmin.resetForm}
              />
              <p className="heading-3">Daftar Film</p>
              <MovieList
                movies={movieAdmin.movies}
                onEdit={movieAdmin.handleEditClick}
                onDelete={movieAdmin.handleDeleteMovie}
              />
            </>
          )}
        </section>
      )}

      {/* CRUD SERIES */}
      {activeTab === "series" && (
        <section className="admin-section">
          <p className="heading-3">Kelola Series</p>

          {seriesAdmin.loading ? (
            <p>Memuat data Series...</p>
          ) : seriesAdmin.error ? (
            <p>{seriesAdmin.error}</p>
          ) : (
            <>
              <SeriesForm
                form={seriesAdmin.form}
                editingId={seriesAdmin.editingId}
                saving={seriesAdmin.saving}
                updateField={seriesAdmin.updateField}
                updateEpisode={seriesAdmin.updateEpisode}
                addEpisode={seriesAdmin.addEpisode}
                removeEpisode={seriesAdmin.removeEpisode}
                handleSubmit={seriesAdmin.handleSubmit}
                resetForm={seriesAdmin.resetForm}
              />
              <p className="heading-3">Daftar Series</p>
              <SeriesList
                series={seriesAdmin.series}
                onEdit={seriesAdmin.handleEditClick}
                onDelete={seriesAdmin.handleDeleteSeries}
              />
            </>
          )}
        </section>
      )}
    </div>
  );
}
