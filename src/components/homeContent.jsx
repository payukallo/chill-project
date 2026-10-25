import { ContinueMovies } from "./continueMovies";
import { NewRelease } from "./newReleaseMovies";
import { Trending } from "./trendingMovies";
import { TopRating } from "./topRatingMovies";

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
