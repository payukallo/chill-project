import { useMyListStore } from "../../stores/useMyListStore";
import type { IMyListMovie } from "../../stores/useMyListStore";
import type { IResponseMovie } from "../type/IResponMovies";

interface UseMyListHoverProps {
  onMovieClick: (movie: IMyListMovie) => void;
}

export function useMyListHover({ onMovieClick }: UseMyListHoverProps) {
  const myMovies = useMyListStore((state) => state.myMovies);

  const handleHoverMovieClick = (selectedMovie: IResponseMovie) => {
    const originalMovie = myMovies.find(
      (item) =>
        Number(item.id) === Number(selectedMovie.id) &&
        item.mediaType === (selectedMovie.type === 0 ? "movie" : "series"),
    );

    if (!originalMovie) return;

    onMovieClick(originalMovie);
  };

  return {
    myMovies,
    handleHoverMovieClick,
  };
}
