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

    void loadHistory();

    return () => {
      active = false;
    };
  }, []);

  const result = useMemo(() => {
    const movieMap = new Map(movies.map((movie) => [movie.id, movie]));
    const seriesMap = new Map(series.map((item) => [item.id, item]));
    const continueMovies: IResponseMovie[] = [];
    const continueSeries: IResponseMovie[] = [];
    const continueAll: IResponseMovie[] = [];
    const seen = new Set<string>();

    // Urutkan seluruh riwayat dari yang paling baru
    const sortedHistory = [...history].sort((a, b) => {
      const dateA = a.last_watched_at
        ? new Date(a.last_watched_at).getTime()
        : 0;

      const dateB = b.last_watched_at
        ? new Date(b.last_watched_at).getTime()
        : 0;

      return dateB - dateA;
    });

    for (const item of sortedHistory) {
      const key = `${item.media_type}:${item.media_id}`;

      // Satu kartu untuk setiap film atau serial
      if (seen.has(key)) continue;

      if (Number(item.is_completed) !== 0) continue;

      const media =
        item.media_type === "movie"
          ? movieMap.get(item.media_id)
          : seriesMap.get(item.media_id);

      if (!media) continue;

      seen.add(key);

      // Gabungkan movie dan series sesuai urutan waktu
      continueAll.push(media);

      if (item.media_type === "movie") {
        continueMovies.push(media);
      } else {
        continueSeries.push(media);
      }
    }

    return {
      continueMovies,
      continueSeries,
      continueAll,
    };
  }, [history, movies, series]);

  return {
    ...result,
    history,
    loading,
  };
}
