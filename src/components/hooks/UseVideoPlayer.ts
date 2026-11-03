import { useCallback, useEffect, useRef } from "react";
import { useVideoPlayerStore } from "../../stores/useVideoPlayerStore";

export function useVideoPlayer() {
  // =========================
  // REF
  // =========================

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // =========================
  // ZUSTAND STORE
  // =========================

  const isPlaying = useVideoPlayerStore((state) => state.isPlaying);
  const setIsPlaying = useVideoPlayerStore((state) => state.setIsPlaying);

  const volume = useVideoPlayerStore((state) => state.volume);
  const setVolume = useVideoPlayerStore((state) => state.setVolume);

  const playbackRate = useVideoPlayerStore((state) => state.playbackRate);
  const setPlaybackRate = useVideoPlayerStore((state) => state.setPlaybackRate);

  const currentTime = useVideoPlayerStore((state) => state.currentTime);
  const setCurrentTime = useVideoPlayerStore((state) => state.setCurrentTime);

  const duration = useVideoPlayerStore((state) => state.duration);
  const setDuration = useVideoPlayerStore((state) => state.setDuration);

  const showDescription = useVideoPlayerStore((state) => state.showDescription);
  const setShowDescription = useVideoPlayerStore(
    (state) => state.setShowDescription,
  );

  const showControls = useVideoPlayerStore((state) => state.showControls);
  const setShowControls = useVideoPlayerStore((state) => state.setShowControls);

  // =========================
  // TIMER CONTROLS
  // =========================
  const clearControlsTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  function showControlsTemporarily() {
    setShowControls(true);
    clearControlsTimeout();

    if (isPlaying && !showDescription) {
      timeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }

  useEffect(() => {
    clearControlsTimeout();

    if (isPlaying && !showDescription) {
      timeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    } else {
      setShowControls(true);
    }

    return clearControlsTimeout;
  }, [isPlaying, showDescription]);

  useEffect(() => {
    return clearControlsTimeout;
  }, []);

  // =========================
  // PLAY / PAUSE
  // =========================

  async function handlePlayPause() {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch (error) {
        console.error("Gagal memutar video:", error);
      }
    } else {
      video.pause();
    }
  }

  // =========================
  // REWIND 10 SECONDS
  // =========================

  function handleRewind() {
    const video = videoRef.current;

    if (!video) return;

    video.currentTime = Math.max(0, video.currentTime - 10);
  }

  // =========================
  // FORWARD 10 SECONDS
  // =========================

  function handleForward() {
    const video = videoRef.current;

    if (!video) return;

    video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
  }

  // =========================
  // VOLUME
  // =========================

  function handleVolume(value: number) {
    const video = videoRef.current;

    if (!video) return;

    video.volume = value;
    video.muted = value === 0;

    setVolume(value);
  }

  // =========================
  // PLAYBACK RATE
  // =========================

  function handlePlaybackRate(value: number) {
    const video = videoRef.current;

    if (!video) return;

    video.playbackRate = value;

    setPlaybackRate(value);
  }

  // =========================
  // SEEK
  // =========================

  function handleSeek(value: number) {
    const video = videoRef.current;

    if (!video) return;

    video.currentTime = value;

    setCurrentTime(value);
  }

  // =========================
  // FULLSCREEN
  // =========================

  async function handleFullscreen() {
    const player = playerRef.current;

    if (!player) return;

    try {
      if (!document.fullscreenElement) {
        await player.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Gagal mengubah fullscreen:", error);
    }
  }

  // =========================
  // FORMAT TIME
  // =========================

  function formatTime(time: number) {
    if (!Number.isFinite(time)) return "00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  }

  // =========================
  // RETURN
  // =========================

  return {
    videoRef,
    playerRef,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    playbackRate,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    showDescription,
    setShowDescription,
    showControls,
    setShowControls,
    showControlsTemporarily,
    clearControlsTimeout,
    handlePlayPause,
    handleRewind,
    handleForward,
    handleVolume,
    handlePlaybackRate,
    handleSeek,
    handleFullscreen,
    formatTime,
  };
}
