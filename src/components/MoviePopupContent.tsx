import MuteVolume from "../assets/logo/mute-volume.png";
import { createPortal } from "react-dom";
import type { IResponseMovie } from "./type/IResponMovies";
import { useMoviePopup } from "./hooks/UseMoviePopup";

interface MoviePopupContentProps {
  movie: IResponseMovie;
  movies: IResponseMovie[];
  onClose: () => void;
  onMovieClick: (movie: IResponseMovie) => void;
  variant: "top" | "bottom";
}

export function MoviePopupContent({
  movie,
  movies,
  onClose,
  onMovieClick,
  variant,
}: MoviePopupContentProps) {
  const {
    isAdded,
    recommendedMovies,
    handleToggleMyList,
    handleSelectRecommendation,
    handleWatchMovie,
  } = useMoviePopup({
    movie,
    movies,
    onMovieClick,
  });

  return createPortal(
    <div className="page-overlay">
      <div
        className={`pop-up-overlay ${
          variant === "top" ? "pop-up-movie-top" : "pop-up-movie-bottom"
        }`}
      >
        {/* =================================
            BANNER DAN TOMBOL
           ================================= */}

        <div className="top-pop-up-container">
          <img src={movie.banner_url} alt={movie.title} />

          <div className="top-pop-up">
            <button className="close" type="button" onClick={onClose}>
              x
            </button>

            <div className="head-pop-up">
              <span className="pop-up-title heading-3">{movie.title}</span>

              <div className="pop-up-btn">
                <div className="pop-up-btn-left">
                  {/* TOMBOL MULAI */}

                  <button
                    className="pop-up-button-left body-medium-bold"
                    type="button"
                    onClick={handleWatchMovie}
                  >
                    Mulai
                  </button>

                  {/* TOMBOL MY LIST */}

                  <button
                    className="add-pop-up text-light-secondary"
                    type="button"
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
            DESKRIPSI FILM
           ================================= */}

        <div className="bottom-pop-up">
          <div className="pop-up-description body-medium-regular">
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
              {/* CAST */}

              <div className="description-right-list">
                <div className="span-pop-up">
                  <span>Cast</span>
                </div>

                <p>: {movie.cast}</p>
              </div>

              {/* GENRE */}

              <div className="description-right-list">
                <div className="span-pop-up">
                  <span>Genre</span>
                </div>

                <p>: {movie.genre?.join(", ") ?? "Belum tersedia"}</p>
              </div>

              {/* PEMBUAT FILM */}

              <div className="description-right-list">
                <div className="span-pop-up">
                  <span>Pembuat Film</span>
                </div>

                <p>: {movie.film_maker}</p>
              </div>
            </div>
          </div>

          {/* =================================
              REKOMENDASI FILM
             ================================= */}

          <div className="pop-up-recommendation">
            <span className="heading-4">Rekomendasi Film</span>

            <div className="box-recommendation"></div>

            <div className="box-recommendation">
              {recommendedMovies.map((recommendedMovie) => (
                <div
                  className="box"
                  key={recommendedMovie.id}
                  onClick={() => handleSelectRecommendation(recommendedMovie)}
                >
                  <img
                    src={recommendedMovie.cover_url}
                    alt={recommendedMovie.title}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
