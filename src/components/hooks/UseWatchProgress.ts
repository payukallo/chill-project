import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { getWatchProgress } from "../type/WatchHistoryApi";
import {
  completeWatchSession,
  createWatchSession,
  savePeriodicProgress,
  type WatchSession,
} from "../../services/watchProgressSession";

export type VideoIdentity = {
  mediaId: number | undefined;
  episodeId: number | null;
  src: string;
};

const SAVE_INTERVAL_MS = 5_000;

function sameVideo(a: VideoIdentity, b: VideoIdentity): boolean {
  return a.mediaId === b.mediaId && a.episodeId === b.episodeId && a.src === b.src;
}

type Options = VideoIdentity & {
  videoRef: RefObject<HTMLVideoElement | null>;
  resetPlayer: () => void;
  setCurrentTime: (value: number) => void;
  setIsPlaying: (value: boolean) => void;
};

type RestoreState = {
  video: HTMLVideoElement;
  ready: boolean;
};

export function useWatchProgress({
  mediaId, episodeId, src, videoRef,
  resetPlayer, setCurrentTime, setIsPlaying,
}: Options) {
  const activeVideoRef = useRef<VideoIdentity>({ mediaId, episodeId, src });
  const activeSessionRef = useRef<WatchSession | null>(null);
  const playStartRef = useRef<number | null>(null);
  const isResettingRef = useRef(false);
  const restoreRef = useRef<RestoreState | null>(null);

  const isCurrentVideo = (video: HTMLVideoElement): boolean =>
    video === videoRef.current &&
    sameVideo(activeVideoRef.current, { mediaId, episodeId, src }) &&
    !isResettingRef.current;

  const isRestoreReady = (video: HTMLVideoElement): boolean =>
    isCurrentVideo(video) && restoreRef.current?.video === video && restoreRef.current.ready;

  // Dipanggil saat metadata dimuat; menunggu GET selesai sebelum autoplay episode baru.
  const restoreWatchPosition = async (video: HTMLVideoElement): Promise<void> => {
    if (!isCurrentVideo(video)) return;
    const state: RestoreState = { video, ready: false };
    restoreRef.current = state;
    playStartRef.current = null;

    try {
      if (mediaId !== undefined && Number.isSafeInteger(mediaId) && mediaId > 0) {
        const progress = await getWatchProgress(mediaId, episodeId);
        if (restoreRef.current !== state || !isCurrentVideo(video)) return;

        const savedSeconds = Number(progress.progress_seconds);
        const isCompleted = Number(progress.is_completed) === 1;
        const duration = video.duration;

        // Episode/film yang selesai tidak di-resume pada bagian akhir.
        // Jangan melompati akhir video jika progress berada persis di durasinya.
        if (
          !isCompleted &&
          Number.isFinite(savedSeconds) && savedSeconds > 0 &&
          Number.isFinite(duration) && duration > 0 &&
          savedSeconds < duration - 1 &&
          video.currentTime === 0
        ) {
          video.currentTime = savedSeconds;
        }
      }
    } catch (error: unknown) {
      // Konten yang belum pernah ditonton dapat belum memiliki watch_history.
      // Bila request gagal, video tetap dapat diputar dari awal.
      console.warn("Progres terakhir tidak dapat dimuat; mulai dari awal:", error);
    } finally {
      if (restoreRef.current === state && isCurrentVideo(video)) {
        state.ready = true;
        setCurrentTime(video.currentTime);
        // Timer 5 detik dimulai setelah restore, bukan selama request GET.
        playStartRef.current = video.paused ? null : Date.now();
      }
    }
  };

  const handlePlay = (video: HTMLVideoElement): void => {
    if (!isCurrentVideo(video)) return;
    setIsPlaying(true);
    playStartRef.current = isRestoreReady(video) ? Date.now() : null;
  };

  const handleTimeUpdate = (video: HTMLVideoElement): void => {
    if (!isCurrentVideo(video)) return;
    setCurrentTime(video.currentTime);
    if (!isRestoreReady(video)) return;
    if (video.paused || video.ended || !Number.isFinite(video.duration) || video.duration <= 0) return;

    const now = Date.now();
    if (playStartRef.current === null) {
      playStartRef.current = now;
      return;
    }
    if (now - playStartRef.current < SAVE_INTERVAL_MS) return;
    playStartRef.current = now;

    const session = activeSessionRef.current;
    if (session && session.mediaId === mediaId && session.episodeId === episodeId) {
      savePeriodicProgress(session, video.currentTime, video.duration);
    }
  };

  const handleSeeked = (video: HTMLVideoElement): void => {
    if (!isCurrentVideo(video)) return;
    setCurrentTime(video.currentTime);
    // Seek (termasuk seek mundur) tidak menyimpan langsung.
    // Hitung 5 detik lagi setelah seek ketika video diputar.
    playStartRef.current = video.paused || !isRestoreReady(video) ? null : Date.now();
  };

  const handlePause = (video: HTMLVideoElement): void => {
    if (!isCurrentVideo(video)) return;
    setIsPlaying(false);
    playStartRef.current = null;
  };

  const handleEnded = async (video: HTMLVideoElement): Promise<boolean> => {
    if (!isCurrentVideo(video)) return false;
    setIsPlaying(false);
    playStartRef.current = null;
    const session = activeSessionRef.current;
    if (!session || session.mediaId !== mediaId || session.episodeId !== episodeId) return false;

    const confirmed = await completeWatchSession(session, video.duration);
    return confirmed && isCurrentVideo(video) && activeSessionRef.current === session;
  };

  const beforeEpisodeChange = (): void => {
    isResettingRef.current = true;
    playStartRef.current = null;
    restoreRef.current = null;
    const video = videoRef.current;
    if (video && !video.paused) video.pause();
  };

  useEffect(() => {
    const next: VideoIdentity = { mediaId, episodeId, src };
    const changed = !sameVideo(activeVideoRef.current, next);
    if (changed) {
      playStartRef.current = null;
      restoreRef.current = null;
      resetPlayer();
    }
    activeVideoRef.current = next;
    isResettingRef.current = false;

    if (
      activeSessionRef.current && !changed &&
      activeSessionRef.current.mediaId === mediaId &&
      activeSessionRef.current.episodeId === episodeId
    ) return;

    activeSessionRef.current =
      mediaId !== undefined && Number.isSafeInteger(mediaId) && mediaId > 0
        ? createWatchSession(mediaId, episodeId)
        : null;
  }, [mediaId, episodeId, src, resetPlayer]);

  return {
    handlePlay,
    handleTimeUpdate,
    handleSeeked,
    handlePause,
    handleEnded,
    beforeEpisodeChange,
    restoreWatchPosition,
    isRestoreReady,
  };
}
