import MuteVolume from "../assets/logo/mute-volume.png";
import { createPortal } from "react-dom";
import type { IResponseMovie } from "./type/IResponMovies";
import { useMyListStore } from "../stores/useMyListStore";
import { useNavigate } from "react-router";

interface IPopUpMovie {
  movie: IResponseMovie;
  movies: IResponseMovie[];
  onClose: () => void;
  onMovieClick: (movie: IResponseMovie) => void;
}

export function PopUpMovieTop({
  movie,
  movies,
  onClose,
  onMovieClick,
}: IPopUpMovie) {
  const navigate = useNavigate();

  function handleWatchMovie() {
    window.open(`/watch/${movie.id}`, "_blank", "noopener,noreferrer");
  }
  const recommendedMovies = movies.filter((item) =>
    movie.recommendation_movie_1?.includes(Number(item.id)),
  );
  const toggleMyList = useMyListStore((state) => state.toggleMyList);
  const isInMyList = useMyListStore((state) => state.isInMyList);

  const isAdded = movie.id != null && isInMyList(movie.id);

  return createPortal(
    <div className="page-overlay">
      <div className="pop-up-overlay pop-up-movie-top">
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
                    onClick={handleWatchMovie}
                  >
                    Mulai
                  </button>

                  <button
                    className="add-pop-up text-light-secondary"
                    onClick={() => toggleMyList(movie)}
                  >
                    {isAdded ? "-" : "+"}
                  </button>
                </div>
                <button id="volume">
                  <img src={MuteVolume} alt="Volume" />
                </button>
              </div>
            </div>
          </div>
        </div>
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
          <div className="pop-up-recommendation">
            <span className="heading-4">Rekomendasi Film</span>
            <div className="box-recommendation"></div>
            <div className="box-recommendation">
              {recommendedMovies.map((recommendedMovie) => (
                <div
                  className="box"
                  key={recommendedMovie.id}
                  onClick={() => onMovieClick(recommendedMovie)}
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
