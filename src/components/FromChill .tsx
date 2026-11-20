import { createPortal } from "react-dom";
import type { IResponseMovie } from "./type/IResponMovies";
import type { IWatchHistory } from "./type/WatchHistoryApi";
import { useMovieCardHover } from "./hooks/UseMovieCardHover";
import { MovieCardHover } from "./MoviesCardHover";
import { SeriesCardHover } from "./SeriesCardHover";
import { MovieCardContent } from "./MovieCardContent";

interface IMoviesFromChill {
  movies: IResponseMovie[];
  headTitle: string;
  on_click: (movie: IResponseMovie) => void;
  history?: IWatchHistory[];
}

export function MoviesFromChill({
  movies,
  headTitle,
  on_click,
  history = [],
}: IMoviesFromChill) {
  const {
    hover,
    hoverRef,
    handleCardEnter,
    handleCardLeave,
    handleHoverLeave,
  } = useMovieCardHover();

  return (
    <div className="movies">
      <h3 className="heading-3">{headTitle}</h3>

      <div className="movie-list">
        {movies.map((movie) => (
          <div
            key={`${movie.type}-${movie.id}`}
            className="movie-card-wrapper-bottom"
            onPointerEnter={(event) => handleCardEnter(event, movie)}
            onPointerLeave={handleCardLeave}
          >
            <div className="box" onClick={() => on_click(movie)}>
              <MovieCardContent movie={movie} />
            </div>
          </div>
        ))}
      </div>

      {hover &&
        createPortal(
          <div
            ref={hoverRef}
            className="box-top-hover"
            style={{
              top: hover.top,
              left: hover.left,
            }}
            onPointerLeave={handleHoverLeave}
          >
            {hover.movie.type === 0 ? (
              <MovieCardHover
                movies={movies}
                movie={hover.movie}
                on_click={on_click}
              />
            ) : hover.movie.type === 1 ? (
              <SeriesCardHover
                movies={movies}
                movie={hover.movie}
                on_click={on_click}
                history={history}
              />
            ) : null}
          </div>,
          document.body,
        )}
    </div>
  );
}
