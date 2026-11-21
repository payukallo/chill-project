import type { IResponseMovie } from "./type/IResponMovies";
import { MoviePopupContent } from "./MoviePopupContent";

interface IPopUpMovie {
  movie: IResponseMovie;
  movies: IResponseMovie[];
  onClose: () => void;
  onMovieClick: (movie: IResponseMovie) => void;
  variant: "top" | "bottom" | "my-list" | "my-list-profile";
}

export function PopUpMovie({
  movie,
  movies,
  onClose,
  onMovieClick,
  variant,
}: IPopUpMovie) {
  return (
    <MoviePopupContent
      movie={movie}
      movies={movies}
      onClose={onClose}
      onMovieClick={onMovieClick}
      variant={variant}
    />
  );
}
