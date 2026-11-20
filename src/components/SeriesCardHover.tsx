import type { IResponseMovie } from "./type/IResponMovies";
import type { IWatchHistory } from "./type/WatchHistoryApi";
import PlayImg from "../assets/logo/play.png";
import VRoundImg from "../assets/logo/v-round.png";
import { useSeriesContinuePlay } from "./hooks/useSeriesContinuePlay";
import { useMoviePopup } from "./hooks/UseMoviePopup";

interface SeriesCardHoverProps {
  movie: IResponseMovie;
  movies: IResponseMovie[];
  on_click: (movie: IResponseMovie) => void;
  history: IWatchHistory[];
}

export function SeriesCardHover({
  movie,
  on_click,
  history,
  movies,
}: SeriesCardHoverProps) {
  const { handleWatchSeries } = useSeriesContinuePlay({
    movie,
    history,
  });

  const { isAdded, handleToggleMyList } = useMoviePopup({
    movie,
    movies,
    onMovieClick: on_click,
  });

  return (
    <div className="hover-movie">
      <div className="hover-img">
        <img src={movie.banner_url} alt={movie.title} />
      </div>

      <div className="hover-bottom-box">
        <div className="hover-button">
          <div>
            {/* TOMBOL PLAY */}
            <button
              type="button"
              onClick={handleWatchSeries}
              aria-label="Lanjutkan menonton Series"
            >
              <img src={PlayImg} alt="" />
            </button>

            {/* TOMBOL MY LIST */}
            <button
              className="add-pop-up text-light-secondary"
              type="button"
              onClick={handleToggleMyList}
              aria-label={
                isAdded ? "Hapus dari My List" : "Tambahkan ke My List"
              }
              aria-pressed={isAdded}
            >
              {isAdded ? "-" : "+"}
            </button>
          </div>

          {/* TOMBOL DETAIL */}
          <button
            type="button"
            onClick={() => on_click(movie)}
            aria-label="Detail Series"
          >
            <img src={VRoundImg} alt="" />
          </button>
        </div>

        <div className="hover-info">
          <div>
            <span className="age-hover">{movie.age_rating}</span>
          </div>

          <span className="heading-5">{movie.duration}</span>
        </div>

        <div className="hover-genre body-large-bold">
          {movie.genre?.slice(0, 3).map((genre, index) => (
            <span key={`${genre}-${index}`} className="body-small-regular">
              {index > 0 && " • "}
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
