import { useMyList } from "../assets/context/MyListContext";
import type { IResponseMovie } from "./type/IResponMovies";

interface IMyListContainer {
  onMovieClick: (movie: IResponseMovie) => void;
}

export function MyListContainerProfile({ onMovieClick }: IMyListContainer) {
  const { myMovies } = useMyList();

  return (
    <div className="list-container profile">
      {myMovies.length > 0 ? (
        myMovies.map((movie) => (
          <div
            className="list-box"
            key={movie.id}
            onClick={() => onMovieClick(movie)}
          >
            <img src={movie.cover_url} alt={movie.title} />
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
          </div>
        ))
      ) : (
        <p>Belum ada film di Daftar Saya.</p>
      )}
    </div>
  );
}
