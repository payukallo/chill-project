import "../assets/styles/admin.css";
import { useRef, useState } from "react";
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

  const [uploading, setUploading] = useState(false);
  const uploadLock = useRef(false);
  const [operationBusy, setOperationBusy] = useState(false);
  const operationLock = useRef(false);

  const runAdminOperation = async (
    operation: () => Promise<void>,
  ) => {
    if (uploadLock.current || operationLock.current) {
      return;
    }

    operationLock.current = true;
    setOperationBusy(true);

    try {
      await operation();
    } finally {
      operationLock.current = false;
      setOperationBusy(false);
    }
  };

  const beginUpload = () => {
    if (uploadLock.current || operationLock.current) {
      return false;
    }

    uploadLock.current = true;
    setUploading(true);

    return true;
  };

  const onUploadBusy = (busy: boolean) => {
    uploadLock.current = busy;
    setUploading(busy);
  };


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
          onClick={() => {
            if (!uploadLock.current && !operationLock.current) {
              setActiveTab("movie");
            }
          }}
          disabled={uploading || operationBusy}
          aria-pressed={activeTab === "movie"}
        >
          Film
        </button>

        <button
          type="button"
          className={activeTab === "series" ? "active" : ""}
          onClick={() => {
            if (!uploadLock.current && !operationLock.current) {
              setActiveTab("series");
            }
          }}
          disabled={uploading || operationBusy}
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
                saving={movieAdmin.saving || operationBusy}
                uploading={uploading}
                onUploadBusy={onUploadBusy}
                beginUpload={beginUpload}

                updateField={movieAdmin.updateField}
                handleSubmit={(event) => {
                  event.preventDefault();

                  void runAdminOperation(() =>
                    movieAdmin.handleSubmit(event)
                  );
                }}
                resetForm={() => {
                  if (!uploadLock.current && !operationLock.current) {
                    movieAdmin.resetForm();
                  }
                }}
              />
              <p className="heading-3">Daftar Film</p>
              <MovieList
                movies={movieAdmin.movies}
                onEdit={(item) => {
                  void runAdminOperation(() =>
                    movieAdmin.handleEditClick(item)
                  );
                }}
                onDelete={(id) => {
                  void runAdminOperation(() =>
                    movieAdmin.handleDeleteMovie(id)
                  );
                }}
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
                saving={seriesAdmin.saving || operationBusy}
                uploading={uploading}
                onUploadBusy={onUploadBusy}
                beginUpload={beginUpload}

                updateField={seriesAdmin.updateField}
                updateEpisode={seriesAdmin.updateEpisode}
                addEpisode={seriesAdmin.addEpisode}
                removeEpisode={seriesAdmin.removeEpisode}
                handleSubmit={(event) => {
                  event.preventDefault();

                  void runAdminOperation(() =>
                    seriesAdmin.handleSubmit(event)
                  );
                }}
                resetForm={() => {
                  if (!uploadLock.current && !operationLock.current) {
                    seriesAdmin.resetForm();
                  }
                }}
              />
              <p className="heading-3">Daftar Series</p>
              <SeriesList
                series={seriesAdmin.series}
                onEdit={(item) => {
                  void runAdminOperation(() =>
                    seriesAdmin.handleEditClick(item)
                  );
                }}
                onDelete={(id) => {
                  void runAdminOperation(() =>
                    seriesAdmin.handleDeleteSeries(id)
                  );
                }}
              />
            </>
          )}
        </section>
      )}
    </div>
  );
}
