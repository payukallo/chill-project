import { NewRelease } from "./NewReleaseMovies";
import { Trending } from "./TrendingMovies";
import { TopRating } from "./TopRatingMovies";
import { SeriesFromChill } from "./SeriesFromChill";
import { ContinueMovies } from "./ContinueMovies";

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
