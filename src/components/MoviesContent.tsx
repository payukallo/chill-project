import { NewRelease } from "./NewReleaseMovies";
import { Trending } from "./TrendingMovies";
import { TopRating } from "./TopRatingMovies";
import { ContinueMovies } from "./ContinueMovies";
import { MoviesFromChill } from "./MoviesFromChill ";

export function MoviesContent() {
  return (
    <div className="content">
      <ContinueMovies />
      <MoviesFromChill/>
      <TopRating />
      <Trending />
      <NewRelease />
    </div>
  );
}
