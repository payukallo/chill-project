import { ContinueMovies } from "./ContinueMovies";
import { NewRelease } from "./NewRelease";
import { TrendingMovies } from "./TrendingMovies";
import { TopRatingMoviesSeries } from "./TopRatingMovies AndSeries";

export function HomeContent() {
  return (
    <div className="content">
      <ContinueMovies />
      <TopRatingMoviesSeries />
      <TrendingMovies />
      <NewRelease />
    </div>
  );
}
