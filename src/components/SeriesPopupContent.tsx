import MuteVolume from "../assets/logo/mute-volume.png";
import { createPortal } from "react-dom";
import type { IResponseMovie, IEpisode } from "./type/IResponMovies";
import { useSeriesPopup } from "./hooks/UseSeriesPopup";

interface SeriesPopupContentProps {
  movie: IResponseMovie;
  onClose: () => void;
  onPlayEpisode: (episode: IEpisode) => void;
  variant: "top" | "bottom";
  fromContinueWatching?: boolean;
}

export function SeriesPopupContent({
  movie,
  onClose,
  onPlayEpisode,
  variant,
  fromContinueWatching = false,
}: SeriesPopupContentProps) {
  const {
    isAdded,
    selectedEpisode,
    resumeLoading,
    handleToggleMyList,
    handleSelectEpisode,
    handlePlay,
    getEpisodeProgress,
    setEpisodeElement,
  } = useSeriesPopup({
    movie,
    fromContinueWatching,
    onPlayEpisode,
  });

  return createPortal(
    <div className="page-overlay">
      <div
        className={`pop-up-overlay ${
          variant === "top" ? "pop-up-series-top" : "pop-up-series-bottom"
        }`}
      >
        {/* =================================
            BANNER DAN TOMBOL
           ================================= */}

        <div className="top-pop-up-container">
          <img src={movie.banner_url} alt={movie.title} />

          <div className="top-pop-up">
            <button className="close" onClick={onClose}>
              x
            </button>

            <div className="head-pop-up">
              <span className="pop-up-title heading-3">{movie.title}</span>

              <div className="pop-up-btn">
                <div className="pop-up-btn-left">
                  <button
                    className="pop-up-button-left body-medium-bold"
                    onClick={handlePlay}
                    disabled={resumeLoading || !selectedEpisode}
                  >
                    Mulai
                  </button>

                  <button
                    className="add-pop-up text-light-secondary"
                    onClick={handleToggleMyList}
                  >
                    {isAdded ? "-" : "+"}
                  </button>
                </div>

                <button id="volume" type="button">
                  <img src={MuteVolume} alt="Volume" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =================================
            DESKRIPSI SERIES
           ================================= */}

        <div className="bottom-pop-up-series">
          <div className="pop-up-description-series body-medium-regular">
            <div className="description-left">
              <div className="year">
                <span>{movie.year}</span>
                <span>{movie.duration}</span>

                <div className="age-recommendation">
                  <span>{movie.age}</span>
                </div>
              </div>

              <p>{movie.description}</p>
            </div>

            <div className="description-right">
              <div className="description-right-list">
                <div className="span-pop-up">
                  <span>Cast</span>
                </div>

                <p>: {movie.cast}</p>
              </div>

              <div className="description-right-list">
                <div className="span-pop-up">
                  <span>Genre</span>
                </div>

                <p>: {movie.genre?.join(", ") ?? "Belum tersedia"}</p>
              </div>

              <div className="description-right-list">
                <div className="span-pop-up">
                  <span>Pembuat Film</span>
                </div>

                <p>: {movie.film_maker}</p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================
            DAFTAR EPISODE
           ================================= */}

        <div className="episode-list-container">
          <h3 className="heading-3">Episode</h3>

          {movie.episodes?.map((episode) => {
            const progress = getEpisodeProgress(episode.episode_id);

            const isActive =
              selectedEpisode?.episode_number === episode.episode_number;

            return (
              <div
                key={episode.episode_number}
                ref={(element) =>
                  setEpisodeElement(episode.episode_number, element)
                }
                className={`episode-item ${isActive ? "active" : ""}`}
                onClick={() => handleSelectEpisode(episode)}
              >
                {/* NOMOR EPISODE */}
                <span className="episode-number">{episode.episode_number}</span>

                {/* =================================
                    THUMBNAIL DAN PROGRESS BAR
                   ================================= */}

                <div className="episode-thumbnail-wrapper">
                  <img
                    src={episode.thumbnail}
                    alt={episode.title}
                    className="episode-thumbnail"
                  />
                  <div
                    className="episode-watch-progress"
                    role="progressbar"
                    aria-label={`Progres episode ${episode.episode_number}`}
                    aria-valuenow={progress.percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="episode-watch-progress-fill"
                      style={{
                        width: `${progress.percent}%`,
                      }}
                    />
                  </div>
                </div>

                {/* =================================
                    INFORMASI EPISODE
                   ================================= */}

                <div className="episode-info">
                  <div className="episode-title-duration">
                    <span className="body-large-semiBold">{episode.title}</span>

                    <span className="body-small-semiBold episode-duration">
                      {episode.duration}
                    </span>
                  </div>

                  <p className="body-large-regular">{episode.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}
