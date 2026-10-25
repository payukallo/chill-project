import { NewRelease } from "./NewReleaseMovies";
import { Trending } from "./TrendingMovies";
import { TopRating } from "./TopRatingMovies";
import { ContinueSeries } from "./ContinueSeries";
import { SeriesFromChill } from "./SeriesFromChill";

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
