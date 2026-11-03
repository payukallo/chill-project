import { useEffect } from "react";
import { useVideoPlayer } from "./hooks/UseVideoPlayer";
import { useVideoPlayerStore } from "../stores/useVideoPlayerStore";

import "../assets/styles/videoPlayer.css";

interface IVideoPlayer {
  src: string;
  title: string;
  description: string;
}

export default function VideoPlayer({ src, title, description }: IVideoPlayer) {
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

  useEffect(() => {
    const video = videoRef.current;

    // Hentikan video sebelumnya
    if (video) {
      video.pause();
    }

    // Reset state Zustand
    resetPlayer();

    return () => {
      video?.pause();
    };
  }, [src, resetPlayer]);

  return (
    <div
      className="video-player"
      ref={playerRef}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => {
        if (isPlaying && !showDescription) {
          clearControlsTimeout();
          setShowControls(false);
        }
      }}
      onTouchStart={showControlsTemporarily}
    >
      <div className="video-screen">
        <video
          ref={videoRef}
          src={src}
          playsInline
          onTimeUpdate={(event) => {
            setCurrentTime(event.currentTarget.currentTime);
          }}
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;

            setDuration(video.duration);
            video.volume = volume;
            video.muted = volume === 0;
            video.playbackRate = playbackRate;
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
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
          onClick={handlePlayPause}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
      </div>

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
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
          />

          <span>{formatTime(duration)}</span>
        </div>

        <div className="video-control-content">

          <div className="video-control-left">
            <button type="button" onClick={handlePlayPause}>
              {isPlaying ? "❚❚" : "▶"}
            </button>
            <button type="button" onClick={handleRewind}>
              ↶ 10
            </button>
            <button type="button" onClick={handleForward}>
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
            <div className="description-control">
              <button
                type="button"
                onClick={() => {
                  setShowDescription(!showDescription);
                  setShowControls(true);
                }}
                title="Deskripsi film"
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
