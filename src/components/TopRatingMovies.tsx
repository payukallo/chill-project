import { useEffect, useState } from "react";
import { IResponseMovie } from "./type/IResponMovies";
import { PopUpMovie } from "./PopUpMovie";

interface ITopRatingMovies {
  id: number;
  movie_id: number;
}

export function TopRatingMovies() {
  const [movies, setMovies] = useState<IResponseMovie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/movies").then((res) => res.json()),
      fetch("http://localhost:3000/top_rating_movie").then((res) => res.json()),
    ])
      .then(([moviesData, propsData]) => {
        const allMovies: IResponseMovie[] = moviesData;
        const listMovie: ITopRatingMovies[] = propsData;

        const boxMovies = listMovie
          .map((item) =>
            allMovies.find(
              (movie) => String(movie.id) === String(item.movie_id),
            ),
          )
          .filter((movie): movie is IResponseMovie => movie !== undefined);

        setMovies(boxMovies);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <div className="movies">
      <h3 className="heading-3">Top Rating Film Hari Ini</h3>

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
          <div className="page-overlay" />
          <PopUpMovie
            movieId={selectedMovieId}
            onClose={() => setSelectedMovieId(null)}
          />
        </>
      )}
    </div>
  );
}
