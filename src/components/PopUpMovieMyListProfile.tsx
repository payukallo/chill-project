import type { IResponseMovie } from "./type/IResponMovies";
import { MoviePopupContent } from "./MoviePopupContent";

interface IPopUpMovie {
  movie: IResponseMovie;
  movies: IResponseMovie[];
  onClose: () => void;
  onMovieClick: (movie: IResponseMovie) => void;
}

export function PopUpMovieMyListProfile({
  movie,
  movies,
  onClose,
  onMovieClick,
}: IPopUpMovie) {
  return (
    <MoviePopupContent
      movie={movie}
      movies={movies}
      onClose={onClose}
      onMovieClick={onMovieClick}
      variant="my-list-profile"
    />
  );
}
