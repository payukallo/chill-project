import { IResponseMovie } from "./type/IResponMovies";
interface IContinueMovie {
  movies: IResponseMovie[];
  headTitle: string;
  on_click: (movie: IResponseMovie) => void;
}

export function ContinueMovie({ movies, headTitle, on_click }: IContinueMovie) {
  return (
    <div className="continue-movies">
      <h3 className="heading-3">{headTitle}</h3>
      <div className="movie-top">
        {movies.map((movie) => (
          <div className="box-top">
            <img
              src={movie.banner_url}
              alt={movie.title}
              onClick={() => on_click(movie)}
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
    </div>
  );
}
