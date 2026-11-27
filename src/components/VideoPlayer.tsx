import "../assets/styles/videoPlayer.css";
import "../assets/styles/episodePopup.css";
import { useEffect, useRef, useState } from "react";
import { useVideoPlayer } from "./hooks/UseVideoPlayer";
import { useWatchProgress } from "./hooks/UseWatchProgress";
import { usePlaybackRefresh } from "./hooks/UsePlaybackRefresh";
import { useVideoPlayerStore } from "../stores/useVideoPlayerStore";
import { EpisodePopup } from "./EpisodePopupVideoPlayer";
import type { IEpisode } from "./type/IResponMovies";

interface IVideoPlayer {
  src: string;
  title: string;
  description: string;
  mediaId?: number;
  episodeId?: number | null;
  episodes?: IEpisode[];
  activeEpisode?: number;
  onEpisodeSelect?: (episode: IEpisode) => void;
}

export default function VideoPlayer({
  src,
  title,
  description,
  mediaId,
  episodeId = null,
  episodes = [],
  activeEpisode = 1,
  onEpisodeSelect,
}: IVideoPlayer) {
  const {
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
  } = useVideoPlayer();

  const resetPlayer = useVideoPlayerStore((state) => state.resetPlayer);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const pendingAutoPlayRef = useRef<{
    episodeId: number | null;
    episodeNumber: number;
  } | null>(null);
  const autoNextInProgressRef = useRef(false);

  const {
    sessionError,
    handlePlay,
    handleTimeUpdate,
    handleSeeked,
    handlePause,
    handleEnded,
    beforeEpisodeChange,
    suspendForRefresh,
    restoreAfterRefresh,
    restoreWatchPosition,
    isRestoreReady,
  } = useWatchProgress({
    mediaId,
    episodeId,
    src,
    videoRef,
    resetPlayer,
    setCurrentTime,
    setIsPlaying,
  });

  const {
    videoSource,
    replacing,
    refreshError,
    handleRefreshMetadata,
    handleRefreshError,
    stopRefresh,
  } = usePlaybackRefresh({
    src,
    mediaId,
    episodeId,
    videoRef,
    suspend: suspendForRefresh,
    restore: restoreAfterRefresh,
    setPlaying: setIsPlaying,
    blocked: Boolean(sessionError),
  });

  const playbackDisabled =
    replacing || Boolean(sessionError || refreshError);

  const handleEpisodeChange = (episode: IEpisode) => {
    pendingAutoPlayRef.current = null;
    if (episode.episode_id === episodeId) {
      setShowEpisodes(false);
      return;
    }
    stopRefresh();
    beforeEpisodeChange();
    onEpisodeSelect?.(episode);
    setShowEpisodes(false);
  };

  // Episode berikutnya ditentukan dari nomor episode, bukan urutan array.
  const playNextEpisode = async (video: HTMLVideoElement) => {
    if (autoNextInProgressRef.current) return;
    autoNextInProgressRef.current = true;
    try {
      const saved = await handleEnded(video);
      if (!saved || !onEpisodeSelect || episodes.length === 0) return;

      const nextEpisode = episodes
        .filter((episode) => episode.episode_number > activeEpisode)
        .sort((a, b) => a.episode_number - b.episode_number)[0];

      if (!nextEpisode) return; // Episode terakhir: cukup berhenti.

      pendingAutoPlayRef.current = {
        episodeId: nextEpisode.episode_id ?? null,
        episodeNumber: nextEpisode.episode_number,
      };
      stopRefresh();
      beforeEpisodeChange();
      setShowEpisodes(false);
      onEpisodeSelect(nextEpisode);
    } finally {
      autoNextInProgressRef.current = false;
    }
  };

  const attemptAutoPlay = () => {
    const pending = pendingAutoPlayRef.current;
    const video = videoRef.current;
    if (!pending || !video) return;
    if (
      (pending.episodeId !== null && episodeId !== pending.episodeId) ||
      activeEpisode !== pending.episodeNumber
    )
      return;
    if (
      video.readyState < HTMLMediaElement.HAVE_METADATA ||
      !isRestoreReady(video)
    )
      return;

    pendingAutoPlayRef.current = null;
    void video.play().catch((error: unknown) => {
      // Beberapa browser memblokir autoplay; pengguna tetap dapat menekan Play.
      console.warn("Autoplay episode berikutnya diblokir browser:", error);
    });
  };

  // Ketika props episode berubah, coba putar video baru setelah siap.
  useEffect(() => {
    attemptAutoPlay();
  }, [src, episodeId, activeEpisode]);

  return (
    <div
      className="video-player"
      ref={playerRef}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => {
        if (isPlaying && !showDescription && !showEpisodes) {
          clearControlsTimeout();
          setShowControls(false);
        }
      }}
      onTouchStart={showControlsTemporarily}
    >
      {(sessionError || refreshError) && (
        <div
          role="alert"
          style={{
            padding: "12px 16px",
            background: "#302020",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          {sessionError || refreshError}
        </div>
      )}

      {replacing && (
        <div role="status">
          Memperbarui akses video...
        </div>
      )}

      <div className="video-screen">
        <video
          key={`${mediaId ?? "unknown"}:${episodeId ?? "movie"}:${src}`}
          ref={videoRef}
          src={videoSource || undefined}
          onError={handleRefreshError}
          playsInline
          onTimeUpdate={(event) => handleTimeUpdate(event.currentTarget)}
          onSeeked={(event) => handleSeeked(event.currentTarget)}
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;
            setDuration(video.duration);
            video.volume = volume;
            video.muted = volume === 0;
            video.playbackRate = playbackRate;
            if (handleRefreshMetadata(video)) return;

            void restoreWatchPosition(video).then(() => attemptAutoPlay());
          }}
          onPlay={(event) => handlePlay(event.currentTarget)}
          onPause={(event) => handlePause(event.currentTarget)}
          onEnded={(event) => {
            if (!playbackDisabled) {
              void playNextEpisode(event.currentTarget);
            }
          }}
          onVolumeChange={(event) => {
            const video = event.currentTarget;
            setVolume(video.muted ? 0 : video.volume);
          }}
        />

        <button
          type="button"
          className={`center-play-button ${
            showControls ? "controls-visible" : "controls-hidden"
          }`}
          disabled={playbackDisabled}
              onClick={handlePlayPause}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
      </div>

      {/* Popup daftar episode */}
      {showEpisodes && episodes.length > 0 && (
        <EpisodePopup
          episodes={episodes}
          activeEpisode={activeEpisode}
          onEpisodeSelect={handleEpisodeChange}
          onClose={() => setShowEpisodes(false)}
        />
      )}

      <div
        className={`video-controls ${
          showControls ? "controls-visible" : "controls-hidden"
        }`}
      >
        <div className="video-progress">
          <span>{formatTime(currentTime)}</span>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            disabled={playbackDisabled}
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
          />

          <span>{formatTime(duration)}</span>
        </div>

        <div className="video-control-content">
          <div className="video-control-left">
            <button type="button" disabled={playbackDisabled}
              onClick={handlePlayPause}>
              {isPlaying ? "❚❚" : "▶"}
            </button>

            <button type="button" disabled={playbackDisabled} onClick={handleRewind}>
              ↶ 10
            </button>

            <button type="button" disabled={playbackDisabled} onClick={handleForward}>
              10 ↷
            </button>

            <div className="volume-control">
              <button
                type="button"
                onClick={() => handleVolume(volume === 0 ? 1 : 0)}
              >
                {volume === 0 ? "🔇" : "🔊"}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => handleVolume(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="video-control-center">
            <span className="body-large-semiBold">{title}</span>
          </div>

          <div className="video-control-right">
            {/* Tombol episode hanya muncul untuk series */}
            {episodes.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setShowEpisodes((prev) => !prev);
                  setShowDescription(false);
                  setShowControls(true);
                }}
                title="Daftar Episode"
              >
                ☷
              </button>
            )}

            <div className="description-control">
              <button
                type="button"
                onClick={() => {
                  setShowDescription(!showDescription);
                  setShowEpisodes(false);
                  setShowControls(true);
                }}
                title="Deskripsi video"
              >
                ⓘ
              </button>

              {showDescription && (
                <div className="description-popup">
                  <h4>{title}</h4>
                  <p>{description}</p>
                </div>
              )}
            </div>

            <select
              value={playbackRate}
              onChange={(e) => handlePlaybackRate(Number(e.target.value))}
              aria-label="Kecepatan video"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>

            <button type="button" onClick={handleFullscreen}>
              ⛶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
