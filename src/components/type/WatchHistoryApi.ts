import { resolveImageUrl } from "../utils/r2ImageUrl";
import { api } from "../utils/axiosApi";

// ========================================
// TYPE WATCH HISTORY
// ========================================

export interface IWatchHistory {
  id: number;
  user_id: number;
  media_id: number;
  episode_id: number | null;
  progress_seconds: number;
  duration_seconds: number | null;
  is_completed: number;
  last_watched_at: string | null;
  media_type: "movie" | "series";
  title: string;
  cover_url: string | null;
  banner_url: string | null;
  episode_number: number | null;
  episode_title: string | null;
}

export interface IWatchProgress {
  id?: number;
  progress_seconds: number;
  duration_seconds: number | null;
  is_completed: number;
  progress_version: number;
}

// ========================================
// TYPE WATCH SESSION
// ========================================

export interface IRegisterWatchSession {
  sessionId: string;
  mediaId: number;
  episodeId: number | null;
}

export interface IRegisterWatchSessionData {
  success: boolean;
  sessionId: string;
  alreadyCompleted?: boolean;
  alreadyRegistered?: boolean;
  isActive?: boolean;
  lastSequence?: number;
}

export interface ISaveSessionProgress {
  sessionId: string;
  mediaId: number;
  episodeId: number | null;
  sequence: number;
  progressSeconds: number;
  durationSeconds: number;
  isCompleted: boolean;
}

export interface ISaveSessionProgressData {
  success: boolean;
  alreadyCompleted?: boolean;
  lastSequence: number;
}

interface IWatchSessionResponse<T> {
  status: string;
  message: string;
  data: T;
}

// ========================================
// CONTINUE WATCHING API
// ========================================

// Mengambil daftar Continue Watching
export async function getWatchHistory(): Promise<IWatchHistory[]> {
  const response = await api.get<{
    status: string;
    message: string;
    data: IWatchHistory[];
  }>("/watch-history");

  return response.data.data.map((item) => ({
    ...item,
    cover_url: resolveImageUrl(item.cover_url),
    banner_url: resolveImageUrl(item.banner_url),
  }));
}

// Mengambil progres terakhir satu film atau episode
export async function getWatchProgress(
  mediaId: number,
  episodeId: number | null = null,
): Promise<IWatchProgress> {
  const response = await api.get<{
    status: string;
    message: string;
    data: IWatchProgress;
  }>("/watch-history/progress", {
    params: {
      mediaId,
      ...(episodeId !== null ? { episodeId } : {}),
    },
  });

  return response.data.data;
}

// ========================================
// WATCH SESSION API
// ========================================

// Mendaftarkan sesi pemutaran
export async function registerWatchSession(
  payload: IRegisterWatchSession,
): Promise<IRegisterWatchSessionData> {
  const response = await api.post<
    IWatchSessionResponse<IRegisterWatchSessionData>
  >("/watch-history/sessions", payload);

  return response.data.data;
}

// Menyimpan progres menggunakan Session ID dan sequence
export async function saveSessionProgress(
  payload: ISaveSessionProgress,
): Promise<ISaveSessionProgressData> {
  const response = await api.post<
    IWatchSessionResponse<ISaveSessionProgressData>
  >("/watch-history/sessions/progress", payload);

  return response.data.data;
}
