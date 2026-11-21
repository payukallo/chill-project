import { useState } from "react";
import type { IMyListMovie } from "../stores/useMyListStore";
import type { IResponseMovie, IEpisode } from "./type/IResponMovies";
import { SeriesPopupContent } from "./SeriesPopupContent";
import { MoviePopupContent } from "./MoviePopupContent";

interface IPopUpMyList {
  movie: IMyListMovie;
  movies: IResponseMovie[];
  onClose: () => void;
}

export function PopUpMyListProfile({ movie, movies, onClose }: IPopUpMyList) {
  // ========================================
  // DATA MOVIE / SERIES
  // ========================================

  const selectedMovie: IResponseMovie = {
    ...movie,
    id: Number(movie.id),
    type: movie.mediaType === "movie" ? 0 : 1,
  };

  const [activeMovie, setActiveMovie] = useState<IResponseMovie>(selectedMovie);

  // ========================================
  // MEMUTAR EPISODE DI TAB BARU
  // ========================================

  const handlePlayEpisode = (episode: IEpisode) => {
    const url =
      `/watch/${selectedMovie.id}` +
      `?type=series&episode=${episode.episode_number}`;

    window.open(url, "_blank", "noopener,noreferrer");

    onClose();
  };

  // ========================================
  // POPUP SERIES
  // ========================================

  if (movie.mediaType === "series") {
    return (
      <SeriesPopupContent
        movie={selectedMovie}
        onClose={onClose}
        onPlayEpisode={handlePlayEpisode}
        fromContinueWatching={true}
        variant="my-list-profile"
      />
    );
  }

  // ========================================
  // POPUP MOVIE
  // ========================================

  return (
    <MoviePopupContent
      movie={activeMovie}
      movies={movies}
      onClose={onClose}
      onMovieClick={setActiveMovie}
      variant="my-list-profile"
    />
  );
}
