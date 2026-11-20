import { useState } from "react";
import type { IMyListMovie } from "../stores/useMyListStore";
import type { IResponseMovie, IEpisode } from "./type/IResponMovies";
import { PopUpMovieMyList } from "./PopUpMovieMyList";
import { PopUpSeriesMyList } from "./PopUpSeriesMyList";

interface IPopUpMyList {
  movie: IMyListMovie;
  movies: IResponseMovie[];
  onClose: () => void;
}

export function PopUpMyList({ movie, movies, onClose }: IPopUpMyList) {
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
      <PopUpSeriesMyList
        movie={selectedMovie}
        onClose={onClose}
        onPlayEpisode={handlePlayEpisode}
        fromContinueWatching={true}
      />
    );
  }

  // ========================================
  // POPUP MOVIE
  // ========================================

  return (
    <PopUpMovieMyList
      movie={activeMovie}
      movies={movies}
      onClose={onClose}
      onMovieClick={setActiveMovie}
    />
  );
}
