import type { IEpisode } from "../type/IResponMovies";
import type { IWatchHistory } from "../type/WatchHistoryApi";

export function getResumeSeriesEpisode(
  episodes: IEpisode[],
  history: IWatchHistory[],
  mediaId: number,
): IEpisode | null {
  const currentHistory = [...history]
    .filter(
      (item) =>
        Number(item.media_id) === Number(mediaId) &&
        item.media_type === "series" &&
        Number(item.is_completed) === 0,
    )
    .sort(
      (a, b) =>
        new Date(b.last_watched_at ?? 0).getTime() -
        new Date(a.last_watched_at ?? 0).getTime(),
    )[0];

  if (!currentHistory) {
    return episodes[0] ?? null;
  }

  const targetEpisode = episodes.find(
    (episode) =>
      currentHistory.episode_id != null &&
      Number(episode.episode_id) === Number(currentHistory.episode_id),
  );

  return targetEpisode ?? episodes[0] ?? null;
}
