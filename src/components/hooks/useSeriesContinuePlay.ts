import type { IResponseMovie } from "../type/IResponMovies";
import type { IWatchHistory } from "../type/WatchHistoryApi";

interface UseSeriesContinuePlayProps {
  movie: IResponseMovie;
  history: IWatchHistory[];
}

export function useSeriesContinuePlay({
  movie,
  history,
}: UseSeriesContinuePlayProps) {
  const handleWatchSeries = () => {
    const lastWatched = history
      .filter(
        (item) =>
          item.media_type === "series" &&
          Number(item.media_id) === Number(movie.id) &&
          Number(item.is_completed) === 0,
      )
      .sort(
        (a, b) =>
          new Date(b.last_watched_at ?? 0).getTime() -
          new Date(a.last_watched_at ?? 0).getTime(),
      )[0];

    const episodeNumber = lastWatched?.episode_number ?? 1;

    window.open(
      `/watch/${movie.id}?type=series&episode=${episodeNumber}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return {
    handleWatchSeries,
  };
}
