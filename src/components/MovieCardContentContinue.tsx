import type { IResponseMovie } from "./type/IResponMovies";

interface IMovieCardContent {
  movie: IResponseMovie;
}

export function MovieCardContentContinue({ movie }: IMovieCardContent) {
  return (
    <>
      <img src={movie.banner_url} alt={movie.title} />

      <div>
        {movie.is_new_episode && (
          <p className="new-episode body-small-bold">Episode Baru</p>
        )}
      </div>

      <div className="bottom-text">
        <p className="heading-6">{movie.title}</p>

        <p className="body-small-regular">★&nbsp;&nbsp;{movie.rating}</p>
      </div>
    </>
  );
}
