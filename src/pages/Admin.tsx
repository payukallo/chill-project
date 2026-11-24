import "../assets/styles/admin.css"
import MovieLogo from "../assets/logo/movie.png";
import { useState } from "react";
import { MovieForm } from "../components/admin/MovieForm";
import { MovieList } from "../components/admin/MovieList";
import { SeriesForm } from "../components/admin/SeriesForm";
import { SeriesList } from "../components/admin/SeriesList";
import { useAdminMovies } from "../components/hooks/useAdminMovies";
import { useAdminSeries } from "../components/hooks/useAdminSeries";
import { NavLink } from "react-router";

type AdminTab = "movie" | "series";

export default function EditMovieSeries() {
  const [activeTab, setActiveTab] = useState<AdminTab>("movie");

  const movieAdmin = useAdminMovies();
  const seriesAdmin = useAdminSeries();

  return (
    <div className="admin-page">
       <div className="navbar-admin">
        <NavLink to="/">
          <img className="logo" src={MovieLogo} width={163} height={44} />
        </NavLink>
        </div>
      <h1>Kelola Movie dan Series</h1>

      {/* PILIHAN TAB */}
      <div className="admin-tabs">
        <button
          type="button"
          className={activeTab === "movie" ? "active" : ""}
          onClick={() => setActiveTab("movie")}
          aria-pressed={activeTab === "movie"}
        >
          Movie
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
        <section className="admin-movie-section">
          <h2>Kelola Film</h2>

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
        <section className="admin-series-section">
          <h2>Kelola Series</h2>

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
