import type { IResponseMovie } from "./type/IResponMovies";

interface IMovieCardContent {
  movie: IResponseMovie;
}

export function MovieCardContent({ movie }: IMovieCardContent) {
  return (
    <>
      <img src={movie.cover_url} alt={movie.title} />

      <div>
        {movie.is_premium && <p className="premium body-small-bold">Premium</p>}

        {movie.is_new_episode && !movie.is_premium && (
          <p className="new-episode body-small-bold">Episode Baru</p>
        )}
        {movie.is_top_10 && <p className="top10 body-small-regular">Top 10</p>}
      </div>

      <div className="bottom-text">
        <p className="heading-6">{movie.title}</p>

        <p className="body-small-regular">★&nbsp;&nbsp;{movie.rating}</p>
      </div>
    </>
  );
}
