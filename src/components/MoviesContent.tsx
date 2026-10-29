import { NewRelease } from "./NewRelease";
import { TrendingMovies } from "./TrendingMovies";
import { TopRatingMovies } from "./TopRatingMovies";
import { ContinueMovies } from "./ContinueMovies";
import { MoviesFromChill } from "./MoviesFromChill ";

export function MoviesContent() {
  return (
    <div className="content">
      <ContinueMovies />
      <MoviesFromChill/>
      <TopRatingMovies />
      <TrendingMovies />
      <NewRelease />
    </div>
  );
}
