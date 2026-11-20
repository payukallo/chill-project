import type { IResponseMovie } from "../type/IResponMovies";
import type { IWatchHistory } from "../type/WatchHistoryApi";
import { getResumeSeriesEpisode } from "../utils/getResumeSeriesEpisode";

interface UseSeriesContinuePlayProps {
  movie: IResponseMovie;
  history: IWatchHistory[];
}

export function useSeriesContinuePlay({
  movie,
  history,
}: UseSeriesContinuePlayProps) {
  const handleWatchSeries = () => {
    console.log("=== DEBUG SERIES HOVER PLAY ===");

    console.log("Series ID:", movie.id);

    console.log("History:", history);

    console.log(
      "History Series:",
      history.filter(
        (item) =>
          item.media_type === "series" &&
          Number(item.media_id) === Number(movie.id),
      ),
    );

    console.log(
      "Episodes:",
      movie.episodes?.map((episode) => ({
        episode_id: episode.episode_id,
        episode_number: episode.episode_number,
      })),
    );

    const episode = getResumeSeriesEpisode(
      movie.episodes ?? [],
      history,
      Number(movie.id),
    );

    if (!episode) return;

    window.open(
      `/watch/${movie.id}?type=series&episode=${episode.episode_number}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return {
    handleWatchSeries,
  };
}
