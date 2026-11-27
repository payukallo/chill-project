import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router";
import { getMovies, getSeries } from "../type/MovieApi";
import { getPlayback } from "../../services/playbackService";
import type { IResponseMovie, IEpisode } from "../type/IResponMovies";

// ========================================
// ERROR HANDLING
// ========================================

const isPremiumRequired = (error: unknown): boolean => {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 403 &&
    error.response?.data?.code === "PREMIUM_REQUIRED"
  );
};

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message || "Gagal mengambil akses pemutaran video."
    );
  }

  return error instanceof Error ? error.message : "Konten gagal dimuat.";
};

// ========================================
// VALIDASI ID
// ========================================

const validateId = (value: unknown, message: string): number => {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    throw new Error(message);
  }

  return value;
};

// ========================================
// USE WATCH MOVIE
// ========================================

export function useWatchPlayback() {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mediaTypeParam = searchParams.get("type");
  const episodeParam = searchParams.get("episode");
  const isSeries = mediaTypeParam === "series" || episodeParam !== null;
  const requestKey = `${id}:${mediaTypeParam}:${episodeParam}`;

  // ========================================
  // STATE
  // ========================================

  const [media, setMedia] = useState<IResponseMovie | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<IEpisode | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isPremiumLocked, setIsPremiumLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [switchingEpisode, setSwitchingEpisode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadedKey, setLoadedKey] = useState("");
  const requestIdRef = useRef(0);

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    const isCurrentRequest = () => requestId === requestIdRef.current;

    async function fetchWatchData() {
      setLoading(true);
      setSwitchingEpisode(false);
      setErrorMessage("");
      setMedia(null);
      setSelectedEpisode(null);
      setVideoUrl("");
      setIsPremiumLocked(false);

      try {
        const mediaId = validateId(Number(id), "Media ID tidak valid.");
        const mediaData = isSeries ? await getSeries() : await getMovies();

        if (!isCurrentRequest()) return;

        const selectedMedia = mediaData.find((item) => item.id === mediaId);

        if (!selectedMedia) {
          throw new Error("Konten tidak ditemukan.");
        }

        let episode: IEpisode | null = null;
        let episodeId: number | null = null;

        if (isSeries) {
          const episodeNumber = validateId(
            Number(episodeParam ?? 1),
            "Nomor episode tidak valid.",
          );

          episode =
            selectedMedia.episodes?.find(
              (item) => item.episode_number === episodeNumber,
            ) ?? null;

          if (!episode) {
            throw new Error("Episode tidak ditemukan.");
          }

          episodeId = validateId(episode.episode_id, "Episode ID tidak valid.");
        }

        // Metadata tetap tersedia untuk overlay premium.
        setMedia(selectedMedia);
        setSelectedEpisode(episode);

        // URL hanya diperoleh melalui Playback API.
        const playback = await getPlayback(mediaId, episodeId);

        if (!isCurrentRequest()) return;

        setVideoUrl(playback.videoUrl);
      } catch (error) {
        if (!isCurrentRequest()) return;

        setVideoUrl("");

        if (isPremiumRequired(error)) {
          setIsPremiumLocked(true);
        } else {
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (isCurrentRequest()) {
          setLoadedKey(requestKey);
          setLoading(false);
        }
      }
    }

    void fetchWatchData();

    return () => {
      requestIdRef.current += 1;
    };
  }, [id, isSeries, episodeParam, requestKey]);

  // ========================================
  // UPDATE EPISODE URL
  // ========================================

  const updateEpisodeUrl = (episode: IEpisode) => {
    const newUrl =
      `${location.pathname}?type=series` + `&episode=${episode.episode_number}`;

    window.history.replaceState(window.history.state, "", newUrl);
  };

  // ========================================
  // CHANGE EPISODE
  // ========================================

  const handleEpisodeSelect = async (episode: IEpisode) => {
    if (!media || !isSeries) return;

    if (episode.episode_id === selectedEpisode?.episode_id) {
      return;
    }

    const requestId = ++requestIdRef.current;
    const isCurrentRequest = () => requestId === requestIdRef.current;

    setSwitchingEpisode(true);
    setErrorMessage("");

    try {
      const mediaId = validateId(media.id, "Media ID tidak valid.");

      const episodeId = validateId(
        episode.episode_id,
        "Episode ID tidak valid.",
      );

      const playback = await getPlayback(mediaId, episodeId);

      if (!isCurrentRequest()) return;

      setSelectedEpisode(episode);
      setVideoUrl(playback.videoUrl);
      setIsPremiumLocked(false);

      updateEpisodeUrl(episode);
    } catch (error) {
      if (!isCurrentRequest()) return;

      setVideoUrl("");

      if (isPremiumRequired(error)) {
        setSelectedEpisode(episode);
        setIsPremiumLocked(true);
        updateEpisodeUrl(episode);
      } else {
        setErrorMessage(getErrorMessage(error));
      }
    } finally {
      if (isCurrentRequest()) {
        setSwitchingEpisode(false);
      }
    }
  };

  // ========================================
  // RETURN
  // ========================================

  return {
    media,
    isSeries,
    selectedEpisode,
    videoUrl,
    isPremiumLocked,
    loading: loading || loadedKey !== requestKey,
    switchingEpisode,
    errorMessage,
    handleEpisodeSelect,
  };
}
