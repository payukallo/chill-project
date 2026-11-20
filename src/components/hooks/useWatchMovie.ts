import type { IResponseMovie } from "../type/IResponMovies";

export function useWatchMovie(movie: IResponseMovie) {
  const handleWatchMovie = () => {
    if (movie.id == null) return;

    const url = `/watch/${movie.id}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return {
    handleWatchMovie,
  };
}
