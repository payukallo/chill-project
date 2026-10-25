import { NewRelease } from "./newReleaseMovies";
import { Trending } from "./trendingMovies";
import { TopRating } from "./topRatingMovies";
import { ContinueSeries } from "./continueSeries";
import { SeriesFromChill } from "./seriesFromChill";

export function SeriesContent() {
  return (
    <div className="content">
      <ContinueSeries />
      <SeriesFromChill/>
      <TopRating />
      <Trending />
      <NewRelease />
    </div>
  );
}
