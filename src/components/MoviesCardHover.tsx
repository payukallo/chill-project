import type { IResponseMovie } from "./type/IResponMovies";
import PlayImg from "../assets/logo/play.png";
import VRoundImg from "../assets/logo/v-round.png";
import { formatDuration } from "./utils/formatDuration";
import { useMoviePopup } from "./hooks/UseMoviePopup";

interface MovieCardHoverProps {
  movie: IResponseMovie;
  movies: IResponseMovie[];
  on_click: (movie: IResponseMovie) => void;
}

export function MovieCardHover({
  movie,
  movies,
  on_click,
}: MovieCardHoverProps) {
  const { isAdded, handleToggleMyList, handleWatchMovie } = useMoviePopup({
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
            <button
              type="button"
              onClick={handleWatchMovie}
              aria-label="Putar Movie"
            >
              <img src={PlayImg} alt="" />
            </button>

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

          <button
            type="button"
            onClick={() => on_click(movie)}
            aria-label="Detail Movie"
          >
            <img src={VRoundImg} alt="" />
          </button>
        </div>

        <div className="hover-info">
          <div>
            <span className="age-hover">{movie.age_rating}</span>
          </div>

          <span className="heading-5">{formatDuration(movie.duration)}</span>
        </div>

        <div className="hover-genre body-large-bold">
          {movie.genre?.slice(0, 1).map((genre) => (
            <span>{genre}</span>
          ))}
          <span>•</span>
          {movie.genre?.slice(1, 2).map((genre) => (
            <span>{genre}</span>
          ))}
          <span>•</span>
          {movie.genre?.slice(2, 3).map((genre) => (
            <span>{genre}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
