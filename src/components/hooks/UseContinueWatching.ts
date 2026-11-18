import { useEffect, useMemo, useState } from "react";
import { getWatchHistory, type IWatchHistory } from "../type/WatchHistoryApi";
import type { IResponseMovie } from "../type/IResponMovies";

interface UseContinueWatchingOptions {
  movies: IResponseMovie[];
  series: IResponseMovie[];
}

export function useContinueWatching({
  movies,
  series,
}: UseContinueWatchingOptions) {
  const [history, setHistory] = useState<IWatchHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      try {
        const data = await getWatchHistory();

        if (active) {
          setHistory(data);
        }
      } catch (error) {
        console.error("Gagal mengambil Continue Watching:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      active = false;
    };
  }, []);

  const result = useMemo(() => {
    const movieMap = new Map(movies.map((movie) => [movie.id, movie]));

    const seriesMap = new Map(series.map((item) => [item.id, item]));

    const continueMovies: IResponseMovie[] = [];
    const continueSeries: IResponseMovie[] = [];

    const seen = new Set<string>();

    for (const item of history) {
      if (Number(item.is_completed) !== 0) continue;

      const key = `${item.media_type}:${item.media_id}`;

      // Satu kartu per film atau serial
      if (seen.has(key)) continue;

      const media =
        item.media_type === "movie"
          ? movieMap.get(item.media_id)
          : seriesMap.get(item.media_id);

      if (!media) continue;

      seen.add(key);

      if (item.media_type === "movie") {
        continueMovies.push(media);
      } else {
        continueSeries.push(media);
      }
    }

    return {
      continueMovies,
      continueSeries,
      continueAll: [...continueMovies, ...continueSeries],
    };
  }, [history, movies, series]);

  return {
    ...result,
    history,
    loading,
  };
}
