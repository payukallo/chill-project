import { createPortal } from "react-dom";
import type { IMyListMovie } from "../stores/useMyListStore";
import type { IResponseMovie } from "./type/IResponMovies";
import type { IWatchHistory } from "./type/WatchHistoryApi";
import { useMovieCardHover } from "./hooks/UseMovieCardHover";
import { useMyListHover } from "./hooks/useMyListHover";
import { MovieCardHover } from "./MoviesCardHover";
import { SeriesCardHover } from "./SeriesCardHover";
import { MovieCardContent } from "./MovieCardContent";

interface IMyListContainer {
  onMovieClick: (movie: IMyListMovie) => void;
  movies: IResponseMovie[];
  history?: IWatchHistory[];
}

export function MyListContainerProfile({
  onMovieClick,
  movies,
  history = [],
}: IMyListContainer) {
  const { myMovies, handleHoverMovieClick } = useMyListHover({ onMovieClick });

  const {
    hover,
    hoverRef,
    handleCardEnter,
    handleCardLeave,
    handleHoverLeave,
  } = useMovieCardHover();

  return (
    <>
      <div className="list-container profile-list">
        {myMovies.length > 0 ? (
          myMovies.map((movie) => {
            const normalizedMovie = {
              ...movie,
              id: Number(movie.id),
              type: movie.mediaType === "movie" ? 0 : 1,
            } as IResponseMovie;

            return (
              <div
                key={movie.myListId}
                onPointerEnter={(event) =>
                  handleCardEnter(event, normalizedMovie)
                }
                onPointerLeave={handleCardLeave}
              >
                <div className="list-box" onClick={() => onMovieClick(movie)}>
                  <MovieCardContent movie={normalizedMovie} />
                </div>
              </div>
            );
          })
        ) : (
          <p>Belum ada film di Daftar Saya.</p>
        )}
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
                on_click={handleHoverMovieClick}
              />
            ) : hover.movie.type === 1 ? (
              <SeriesCardHover
                movies={movies}
                movie={hover.movie}
                on_click={handleHoverMovieClick}
                history={history}
              />
            ) : null}
          </div>,
          document.body,
        )}
    </>
  );
}
