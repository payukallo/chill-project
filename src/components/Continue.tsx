import { createPortal } from "react-dom";
import type { IResponseMovie } from "./type/IResponMovies";
import type { IWatchHistory } from "./type/WatchHistoryApi";
import { MovieCardContentContinue } from "./MovieCardContentContinue";
import { useMovieCardHover } from "./hooks/UseMovieCardHover";
import { MovieCardHover } from "./MoviesCardHover";
import { SeriesCardHover } from "./SeriesCardHover";

interface IContinueMovie {
  movies: IResponseMovie[];
  headTitle: string;
  on_click: (movie: IResponseMovie) => void;
  history?: IWatchHistory[];
}

export function ContinueMovie({
  movies,
  headTitle,
  on_click,
  history = [],
}: IContinueMovie) {
  const {
    hover,
    hoverRef,
    handleCardEnter,
    handleCardLeave,
    handleHoverLeave,
  } = useMovieCardHover();

  return (
    <div className="continue-movies">
      <h3 className="heading-3">{headTitle}</h3>

      <div className="movie-top">
        {movies.map((movie) => (
          <div
            key={`${movie.type}-${movie.id}`}
            className="movie-card-wrapper"
            onPointerEnter={(event) => handleCardEnter(event, movie)}
            onPointerLeave={handleCardLeave}
          >
            <div className="box-top" onClick={() => on_click(movie)}>
              <MovieCardContentContinue movie={movie} />
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
