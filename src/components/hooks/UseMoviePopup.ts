import type { IResponseMovie } from "../type/IResponMovies";
import { useMyListStore } from "../../stores/useMyListStore";
import { useWatchMovie } from "./useWatchMovie";

interface UseMoviePopupProps {
  movie: IResponseMovie;
  movies: IResponseMovie[];
  onMovieClick: (movie: IResponseMovie) => void;
}

export function useMoviePopup({
  movie,
  movies,
  onMovieClick,
}: UseMoviePopupProps) {
  // ========================================
  // MY LIST
  // ========================================

  const toggleMyList = useMyListStore((state) => state.toggleMyList);
  const myMovies = useMyListStore((state) => state.myMovies);
  const isAdded = myMovies.some(
    (item) =>
      String(item.id) === String(movie.id) &&
      item.mediaType === (movie.type === 0 ? "movie" : "series"),
  );

  const handleToggleMyList = () => {
    void toggleMyList(movie);
  };

  // ========================================
  // REKOMENDASI FILM
  // ========================================

  const recommendedMovies = (movies ?? []).filter((item) =>
    movie.recommendation_movie_1?.includes(Number(item.id)),
  );

  const handleSelectRecommendation = (recommendedMovie: IResponseMovie) => {
    onMovieClick(recommendedMovie);
  };

  // ========================================
  // MEMUTAR FILM DI TAB BARU
  // ========================================

  const { handleWatchMovie } = useWatchMovie(movie);

  // ========================================
  // RETURN HOOK
  // ========================================

  return {
    isAdded,
    recommendedMovies,
    handleToggleMyList,
    handleSelectRecommendation,
    handleWatchMovie,
  };
}
