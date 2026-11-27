import { resolveImageUrl } from "../utils/r2ImageUrl";
import type { IAdminMovie } from "../type/IAdminMovie";

interface MovieListProps {
  movies: IAdminMovie[];
  onEdit: (movie: IAdminMovie) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
}

export function MovieList({ movies, onEdit, onDelete }: MovieListProps) {
  return (
    <div className="admin-list">
      {movies.length === 0 ? (
        <p>Belum ada film yang tersedia.</p>
      ) : (
        movies.map((movie) => (
          <div key={movie.id} className="series-admin-item">
            <div className="box-series">
              <img src={resolveImageUrl(movie.banner_url) ?? undefined} alt={movie.title} />
              <div>
                {movie.is_premium ? (
                  <p className="premium body-small-bold">Premium</p>
                ) : null}
                {movie.is_top_10 ? (
                  <p className="top10 body-small-regular">Top 10</p>
                ) : null}
              </div>
              <div className="bottom-text">
                <div className="bottom-text-box">
                  <p className="heading-6">{movie.title}</p>
                  <p className="body-small-regular">
                    ★&nbsp;&nbsp;{movie.rating}/5
                  </p>
                </div>
                <div className="admin-button">
                  <button type="button" onClick={() => void onEdit(movie)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => void onDelete(movie.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
