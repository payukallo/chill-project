import { NewRelease } from "./newReleaseMovies";
import { Trending } from "./trendingMovies";
import { TopRating } from "./topRatingMovies";
import { SeriesFromChill } from "./seriesFromChill";
import { ContinueMovies } from "./continueMovies";

export function MoviesContent() {
  return (
    <div className="content">
      <ContinueMovies />
      <SeriesFromChill/>
      <TopRating />
      <Trending />
      <NewRelease />
    </div>
  );
}
