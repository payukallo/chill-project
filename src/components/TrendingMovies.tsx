import { useEffect, useState } from "react";
import type { IResponseMovie } from "./type/IResponMovies";
import { PopUpMovie } from "./PopUpMovie";

export function TrendingMovies() {
  const [movies, setMovies] = useState<IResponseMovie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchTrendingMovies() {
      try {
        const response = await fetch("http://localhost:3000/movies");

        if (!response.ok) {
          throw new Error("Gagal mengambil data film");
        }

        const allMovies: IResponseMovie[] = await response.json();
        const top10Movies = allMovies.filter(
          (movie) => movie.is_top_10 === true,
        );

        setMovies(top10Movies);
      } catch (error) {
        console.error("Fetch trending movies error:", error);
      }
    }

    fetchTrendingMovies();
  }, []);

  return (
    <div className="movies">
      <h3 className="heading-3">Film Trending</h3>

      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="box">
            <img
              src={movie.cover_url}
              alt={movie.title}
              onClick={() => {
                if (movie.id !== undefined) {
                  setSelectedMovieId(movie.id);
                }
              }}
            />

            <div>
              {movie.is_premium && (
                <p className="premium body-small-bold">Premium</p>
              )}

              {movie.is_new_episode && !movie.is_premium && (
                <p className="new-episode body-small-bold">Episode Baru</p>
              )}

              {movie.is_top_10 && (
                <p className="top10 body-small-regular">Top 10</p>
              )}
            </div>

            <div className="bottom-text">
              <p className="heading-6">{movie.title}</p>
              <p className="body-small-regular">{movie.rating}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedMovieId !== null && (
        <>
          <div
            className="page-overlay"
            onClick={() => setSelectedMovieId(null)}
          />
          <PopUpMovie
            movieId={selectedMovieId}
            onClose={() => setSelectedMovieId(null)}
          />
        </>
      )}
    </div>
  );
}
