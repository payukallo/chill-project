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
): Promise<IPlaybackData> => {
  const response = await api.get<IPlaybackResponse>(`/playback/${mediaId}`, {
    params: episodeId !== null ? { episodeId } : undefined,
  });

  return response.data.data;
};
