import { useEffect, useState } from "react";
import type { IResponseMovie } from "./type/IResponMovies";
import { PopUpMovie } from "./PopUpMovie";
interface IRecommendation {
  showPopup?: boolean;
  onMovieSelect?: (movieId: number) => void;
}

export function Recommendation({
  showPopup = true,
  onMovieSelect,
}: IRecommendation) {
  const [randomMovies, setRandomMovies] = useState<IResponseMovie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/movies")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data film");
        }

        return response.json();
      })
      .then((data: IResponseMovie[]) => {
        const shuffledMovies = [...data].sort(() => Math.random() - 0.5);

        setRandomMovies(shuffledMovies.slice(0, 3));
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      {randomMovies.map((movie) => (
        <div key={movie.id} className="box">
          <img
            src={movie.cover_url}
            alt={movie.title}
            onClick={() => {
              if (movie.id === undefined) return;

              if (onMovieSelect) {
                onMovieSelect(movie.id);
              } else if (showPopup) {
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

      {showPopup && selectedMovieId !== null && (
        <>
          <div
            className="page-overlay"
            onClick={() => setSelectedMovieId(null)}
          />

          <PopUpMovie
            key={selectedMovieId}
            movieId={selectedMovieId}
            onClose={() => setSelectedMovieId(null)}
          />
        </>
      )}
    </>
  );
}
