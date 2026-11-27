import { api } from "../components/utils/axiosApi";

// ========================================
// PLAYBACK DATA
// ========================================

export interface IPlaybackData {
  mediaId: number;
  episodeId: number | null;
  mediaType: "movie" | "series";
  isPremium: boolean;
  videoUrl: string;
  expiresIn: number;
}

// ========================================
// PLAYBACK RESPONSE
// ========================================

interface IPlaybackResponse {
  message: string;
  data: IPlaybackData;
}

// ========================================
// GET PLAYBACK ACCESS
// ========================================

export const getPlayback = async (
  mediaId: number,
  episodeId: number | null = null,
  signal?: AbortSignal,
): Promise<IPlaybackData> => {
  const response = await api.get<IPlaybackResponse>(`/playback/${mediaId}`, {
    params: episodeId !== null ? { episodeId } : undefined,
    signal,
    ...(signal ? { timeout: 15000 } : {}),
  });

  return response.data.data;
};
