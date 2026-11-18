import { useEffect, useRef, useState } from "react";
import type { IResponseMovie, IEpisode } from "../type/IResponMovies";
import { getWatchHistory, getWatchProgress } from "../type/WatchHistoryApi";
import { useMyListStore } from "../../stores/useMyListStore";

export type EpisodeProgress = {
  percent: number;
  completed: boolean;
};

interface UseSeriesPopupProps {
  movie: IResponseMovie;
  fromContinueWatching?: boolean;
  onPlayEpisode: (episode: IEpisode) => void;
}

// HELPER FUNCTIONS

const EMPTY_PROGRESS: EpisodeProgress = {
  percent: 0,
  completed: false,
};

// Memvalidasi ID media atau episode
const isValidId = (id: number | undefined | null): id is number => {
  return typeof id === "number" && Number.isSafeInteger(id) && id > 0;
};

// Menghitung persentase progres
const calculateProgress = (
  position: number,
  duration: number | null,
  completed: boolean,
): number => {
  if (completed) return 100;

  if (
    !Number.isFinite(position) ||
    duration === null ||
    !Number.isFinite(duration) ||
    duration <= 0
  ) {
    return 0;
  }

  return Math.min(99, Math.max(0, Math.floor((position / duration) * 100)));
};

// USE SERIES POPUP

export function useSeriesPopup({
  movie,
  fromContinueWatching = false,
  onPlayEpisode,
}: UseSeriesPopupProps) {
  // MY LIST

  const toggleMyList = useMyListStore((state) => state.toggleMyList);
  const myMovies = useMyListStore((state) => state.myMovies);
  const isAdded = myMovies.some(
    (item) =>
      String(item.id) === String(movie.id) && item.mediaType === "series",
  );

  const handleToggleMyList = () => {
    void toggleMyList(movie);
  };

  // STATE EPISODE

  const [selectedEpisode, setSelectedEpisode] = useState<IEpisode | null>(
    movie.episodes?.[0] ?? null,
  );

  const [episodeProgress, setEpisodeProgress] = useState<
    Record<number, EpisodeProgress>
  >({});

  const [focusEpisodeNumber, setFocusEpisodeNumber] = useState<number | null>(
    null,
  );

  const [resumeLoading, setResumeLoading] = useState(fromContinueWatching);
  const episodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // MENGAMBIL PROGRES SETIAP EPISODE

  useEffect(() => {
    let active = true;

    const loadEpisodeProgress = async () => {
      const mediaId = movie.id;

      // Validasi media ID sebelum mengakses API
      if (!isValidId(mediaId)) {
        console.warn("Gagal mengambil progres: mediaId tidak valid", mediaId);
        return;
      }

      const episodes = movie.episodes ?? [];
      const results = await Promise.all(
        episodes.map(async (episode) => {
          const episodeId = episode.episode_id;

          // Validasi episode ID
          if (!isValidId(episodeId)) {
            return null;
          }

          try {
            // mediaId dan episodeId sudah bertipe number
            const progress = await getWatchProgress(mediaId, episodeId);

            const completed = Number(progress.is_completed) === 1;

            const percent = calculateProgress(
              Number(progress.progress_seconds),
              progress.duration_seconds,
              completed,
            );

            return {
              episodeId,
              percent,
              completed,
            };
          } catch (error) {
            console.error(
              `Gagal mengambil progres episode ${episode.episode_number}:`,
              error,
            );

            return null;
          }
        }),
      );

      if (!active) return;

      const progressMap: Record<number, EpisodeProgress> = {};

      for (const result of results) {
        if (!result) continue;

        progressMap[result.episodeId] = {
          percent: result.percent,
          completed: result.completed,
        };
      }

      setEpisodeProgress(progressMap);
    };

    // Kosongkan progres saat serial berubah
    setEpisodeProgress({});

    void loadEpisodeProgress();

    return () => {
      active = false;
    };
  }, [movie.id, movie.episodes]);

  // MENENTUKAN EPISODE CONTINUE WATCHING

  useEffect(() => {
    let active = true;

    const loadResumeEpisode = async () => {
      const mediaId = movie.id;

      if (!isValidId(mediaId)) {
        return;
      }

      try {
        const history = await getWatchHistory();

        if (!active) return;

        console.log("=== DEBUG CONTINUE WATCHING ===");
        console.log("fromContinueWatching:", fromContinueWatching);
        console.log("Media ID:", mediaId);
        console.log("Watch History:", history);
        console.log("Daftar Episode:", movie.episodes);

        // Cari riwayat serial
        const currentHistory = history.find(
          (item) =>
            Number(item.media_id) === mediaId && item.media_type === "series",
        );

        console.log("Current History:", currentHistory);

        if (!currentHistory) {
          console.warn("Riwayat serial tidak ditemukan");
          return;
        }

        // Cocokkan menggunakan ID episode terlebih dahulu
        const targetEpisode = movie.episodes?.find(
          (episode) =>
            currentHistory.episode_id != null &&
            Number(episode.episode_id) === Number(currentHistory.episode_id),
        );

        console.log("Target Episode:", targetEpisode);

        if (!targetEpisode) {
          console.warn("Episode pada riwayat tidak ditemukan di katalog", {
            historyEpisodeId: currentHistory.episode_id,
            catalogEpisodes: movie.episodes?.map((episode) => ({
              episode_id: episode.episode_id,
              episode_number: episode.episode_number,
            })),
          });

          return;
        }

        setSelectedEpisode(targetEpisode);
        setFocusEpisodeNumber(targetEpisode.episode_number);
      } catch (error) {
        console.error("Gagal menentukan episode Continue Watching:", error);
      } finally {
        if (active) {
          setResumeLoading(false);
        }
      }
    };

    // Reset saat popup menerima serial baru
    setSelectedEpisode(movie.episodes?.[0] ?? null);
    setFocusEpisodeNumber(null);
    setResumeLoading(fromContinueWatching);

    if (fromContinueWatching) {
      void loadResumeEpisode();
    }

    return () => {
      active = false;
    };
  }, [movie.id, movie.episodes, fromContinueWatching]);

  // SCROLL KE EPISODE YANG DIFOKUSKAN

  useEffect(() => {
    if (focusEpisodeNumber === null) return;

    const element = episodeRefs.current[focusEpisodeNumber];

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [focusEpisodeNumber]);

  // MENYIMPAN REFERENSI ELEMEN EPISODE

  const setEpisodeElement = (
    episodeNumber: number,
    element: HTMLDivElement | null,
  ) => {
    episodeRefs.current[episodeNumber] = element;
  };

  // MEMILIH EPISODE

  const handleSelectEpisode = (episode: IEpisode) => {
    setSelectedEpisode(episode);
  };

  // MEMUTAR EPISODE

  const handlePlay = () => {
    if (resumeLoading || !selectedEpisode) {
      return;
    }

    onPlayEpisode(selectedEpisode);
  };

  // MENGAMBIL PROGRES EPISODE

  const getEpisodeProgress = (
    episodeId: number | undefined,
  ): EpisodeProgress => {
    if (!isValidId(episodeId)) {
      return EMPTY_PROGRESS;
    }

    return episodeProgress[episodeId] ?? EMPTY_PROGRESS;
  };

  // RETURN HOOK

  return {
    isAdded,
    selectedEpisode,
    resumeLoading,
    handleToggleMyList,
    handleSelectEpisode,
    handlePlay,
    getEpisodeProgress,
    setEpisodeElement,
  };
}
