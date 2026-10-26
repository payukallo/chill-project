import { ContinueMovies } from "./ContinueMovies";
import { NewRelease } from "./NewReleaseMovies";
import { Trending } from "./TrendingMovies";
import { TopRating } from "./TopRatingMovies";

export function HomeContent() {
  return (
    <div className="content">
      <ContinueMovies />
      <TopRating />
      <Trending />
      <NewRelease />
    </div>
  );
}
