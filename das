[1mdiff --git a/src/components/VideoPlayer.tsx b/src/components/VideoPlayer.tsx[m
[1mindex 87db473..cd168c0 100644[m
[1m--- a/src/components/VideoPlayer.tsx[m
[1m+++ b/src/components/VideoPlayer.tsx[m
[36m@@ -3,6 +3,7 @@[m [mimport "../assets/styles/episodePopup.css";[m
 import { useEffect, useRef, useState } from "react";[m
 import { useVideoPlayer } from "./hooks/UseVideoPlayer";[m
 import { useWatchProgress } from "./hooks/UseWatchProgress";[m
[32m+[m[32mimport { usePlaybackRefresh } from "./hooks/UsePlaybackRefresh";[m
 import { useVideoPlayerStore } from "../stores/useVideoPlayerStore";[m
 import { EpisodePopup } from "./EpisodePopupVideoPlayer";[m
 import type { IEpisode } from "./type/IResponMovies";[m
[36m@@ -72,6 +73,8 @@[m [mexport default function VideoPlayer({[m
     handlePause,[m
     handleEnded,[m
     beforeEpisodeChange,[m
[32m+[m[32m    suspendForRefresh,[m
[32m+[m[32m    restoreAfterRefresh,[m
     restoreWatchPosition,[m
     isRestoreReady,[m
   } = useWatchProgress({[m
[36m@@ -84,12 +87,34 @@[m [mexport default function VideoPlayer({[m
     setIsPlaying,[m
   });[m
 [m
[32m+[m[32m  const {[m
[32m+[m[32m    videoSource,[m
[32m+[m[32m    replacing,[m
[32m+[m[32m    refreshError,[m
[32m+[m[32m    handleRefreshMetadata,[m
[32m+[m[32m    handleRefreshError,[m
[32m+[m[32m    stopRefresh,[m
[32m+[m[32m  } = usePlaybackRefresh({[m
[32m+[m[32m    src,[m
[32m+[m[32m    mediaId,[m
[32m+[m[32m    episodeId,[m
[32m+[m[32m    videoRef,[m
[32m+[m[32m    suspend: suspendForRefresh,[m
[32m+[m[32m    restore: restoreAfterRefresh,[m
[32m+[m[32m    setPlaying: setIsPlaying,[m
[32m+[m[32m    blocked: Boolean(sessionError),[m
[32m+[m[32m  });[m
[32m+[m
[32m+[m[32m  const playbackDisabled =[m
[32m+[m[32m    replacing || Boolean(sessionError || refreshError);[m
[32m+[m
   const handleEpisodeChange = (episode: IEpisode) => {[m
     pendingAutoPlayRef.current = null;[m
     if (episode.episode_id === episodeId) {[m
       setShowEpisodes(false);[m
       return;[m
     }[m
[32m+[m[32m    stopRefresh();[m
     beforeEpisodeChange();[m
     onEpisodeSelect?.(episode);[m
     setShowEpisodes(false);[m
[36m@@ -113,7 +138,8 @@[m [mexport default function VideoPlayer({[m
         episodeId: nextEpisode.episode_id ?? null,[m
         episodeNumber: nextEpisode.episode_number,[m
       };[m
[31m-      beforeEpisodeChange();[m
[32m+[m[32m      stopRefresh();[m
[32m+[m[32m    beforeEpisodeChange();[m
       setShowEpisodes(false);[m
       onEpisodeSelect(nextEpisode);[m
     } finally {[m
[36m@@ -161,7 +187,7 @@[m [mexport default function VideoPlayer({[m
       }}[m
       onTouchStart={showControlsTemporarily}[m
     >[m
[31m-      {sessionError && ([m
[32m+[m[32m      {(sessionError || refreshError) && ([m
         <div[m
           role="alert"[m
           style={{[m
[36m@@ -171,7 +197,13 @@[m [mexport default function VideoPlayer({[m
             textAlign: "center",[m
           }}[m
         >[m
[31m-          {sessionError}[m
[32m+[m[32m          {sessionError || refreshError}[m
[32m+[m[32m        </div>[m
[32m+[m[32m      )}[m
[32m+[m
[32m+[m[32m      {replacing && ([m
[32m+[m[32m        <div role="status">[m
[32m+[m[32m          Memperbarui akses video...[m
         </div>[m
       )}[m
 [m
[36m@@ -179,7 +211,8 @@[m [mexport default function VideoPlayer({[m
         <video[m
           key={`${mediaId ?? "unknown"}:${episodeId ?? "movie"}:${src}`}[m
           ref={videoRef}[m
[31m-          src={src}[m
[32m+[m[32m          src={videoSource || undefined}[m
[32m+[m[32m          onError={handleRefreshError}[m
           playsInline[m
           onTimeUpdate={(event) => handleTimeUpdate(event.currentTarget)}[m
           onSeeked={(event) => handleSeeked(event.currentTarget)}[m
[36m@@ -189,12 +222,16 @@[m [mexport default function VideoPlayer({[m
             video.volume = volume;[m
             video.muted = volume === 0;[m
             video.playbackRate = playbackRate;[m
[32m+[m[32m            if (handleRefreshMetadata(video)) return;[m
[32m+[m
             void restoreWatchPosition(video).then(() => attemptAutoPlay());[m
           }}[m
           onPlay={(event) => handlePlay(event.currentTarget)}[m
           onPause={(event) => handlePause(event.currentTarget)}[m
           onEnded={(event) => {[m
[31m-            void playNextEpisode(event.currentTarget);[m
[32m+[m[32m            if (!playbackDisabled) {[m
[32m+[m[32m              void playNextEpisode(event.currentTarget);[m
[32m+[m[32m            }[m
           }}[m
           onVolumeChange={(event) => {[m
             const video = event.currentTarget;[m
[36m@@ -207,7 +244,7 @@[m [mexport default function VideoPlayer({[m
           className={`center-play-button ${[m
             showControls ? "controls-visible" : "controls-hidden"[m
           }`}[m
[31m-          disabled={Boolean(sessionError)}[m
[32m+[m[32m          disabled={playbackDisabled}[m
               onClick={handlePlayPause}[m
           title={isPlaying ? "Pause" : "Play"}[m
         >[m
[36m@@ -238,6 +275,7 @@[m [mexport default function VideoPlayer({[m
             min={0}[m
             max={duration || 0}[m
             step={0.1}[m
[32m+[m[32m            disabled={playbackDisabled}[m
             value={currentTime}[m
             onChange={(e) => handleSeek(Number(e.target.value))}[m
           />[m
[36m@@ -247,16 +285,16 @@[m [mexport default function VideoPlayer({[m
 [m
         <div className="video-control-content">[m
           <div className="video-control-left">[m
[31m-            <button type="button" disabled={Boolean(sessionError)}[m
[32m+[m[32m            <button type="button" disabled={playbackDisabled}[m
               onClick={handlePlayPause}>[m
               {isPlaying ? "❚❚" : "▶"}[m
             </button>[m
 [m
[31m-            <button type="button" onClick={handleRewind}>[m
[32m+[m[32m            <button type="button" disabled={playbackDisabled} onClick={handleRewind}>[m
               ↶ 10[m
             </button>[m
 [m
[31m-            <button type="button" onClick={handleForward}>[m
[32m+[m[32m            <button type="button" disabled={playbackDisabled} onClick={handleForward}>[m
               10 ↷[m
             </button>[m
 [m
[1mdiff --git a/src/components/hooks/UseWatchProgress.ts b/src/components/hooks/UseWatchProgress.ts[m
[1mindex d3e32c0..f47d3de 100644[m
[1m--- a/src/components/hooks/UseWatchProgress.ts[m
[1m+++ b/src/components/hooks/UseWatchProgress.ts[m
[36m@@ -232,6 +232,42 @@[m [mexport function useWatchProgress({[m
     );[m
   };[m
 [m
[32m+[m[32m  // Refresh Signed URL bukan sesi pemutaran baru.[m
[32m+[m[32m  const suspendForRefresh = ([m
[32m+[m[32m    video: HTMLVideoElement,[m
[32m+[m[32m  ): boolean => {[m
[32m+[m[32m    const ready = isRestoreReady(video);[m
[32m+[m
[32m+[m[32m    playStartRef.current = null;[m
[32m+[m[32m    restoreRef.current = null;[m
[32m+[m
[32m+[m[32m    return ready;[m
[32m+[m[32m  };[m
[32m+[m
[32m+[m[32m  const restoreAfterRefresh = ([m
[32m+[m[32m    video: HTMLVideoElement,[m
[32m+[m[32m  ): boolean => {[m
[32m+[m[32m    if (!isCurrentVideo(video)) return false;[m
[32m+[m
[32m+[m[32m    if (activeSessionRef.current?.status === "blocked") {[m
[32m+[m[32m      video.pause();[m
[32m+[m[32m      setIsPlaying(false);[m
[32m+[m[32m      return false;[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    restoreRef.current = {[m
[32m+[m[32m      video,[m
[32m+[m[32m      ready: true,[m
[32m+[m[32m    };[m
[32m+[m
[32m+[m[32m    playStartRef.current = null;[m
[32m+[m
[32m+[m[32m    setCurrentTime(video.currentTime);[m
[32m+[m[32m    setIsPlaying(false);[m
[32m+[m
[32m+[m[32m    return true;[m
[32m+[m[32m  };[m
[32m+[m
   const beforeEpisodeChange = (): void => {[m
     isR