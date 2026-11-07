import { create } from "zustand";
import axios from "axios";
import type { IResponseMovie } from "../components/type/IResponMovies";
import { supabase } from "../components/utils/supabase";
import { api } from "../components/utils/axiosApi";

export interface IMyListMovie extends Omit<IResponseMovie, "id"> {
  id: string;
  myListId: string;
  mediaType: "movie" | "series";
}

interface IMyListRecord {
  id: string;
  media_id: string;
  media_type: "movie" | "series";
}

interface IMediaRow {
  id: string;
  data: IResponseMovie;
}

interface IMyListStore {
  myMovies: IMyListMovie[];

  setMyMovies: (movies: IMyListMovie[]) => void;
  fetchMyList: (userId: string) => Promise<void>;
  toggleMyList: (movie: IResponseMovie | IMyListMovie) => Promise<void>;

  isInMyList: (
    movieId: string | number,
    mediaType?: "movie" | "series",
  ) => boolean;
}

// Mencegah request ganda untuk film yang sama
const pendingMovies = new Set<string>();

// Menghindari hasil request lama menimpa data terbaru
let requestId = 0;

async function getAuthHeaders() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;

  if (!session) {
    throw new Error("Silakan login terlebih dahulu.");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}

export const useMyListStore = create<IMyListStore>((set, get) => ({
  myMovies: [],

  setMyMovies: (movies) => set({ myMovies: movies }),

  // =========================
  // READ MY LIST
  // =========================

  fetchMyList: async (userId) => {
    const currentRequest = ++requestId;

    try {
      const headers = await getAuthHeaders();

      const response = await api.get<IMyListRecord[]>("/my_list", {
        params: {
          select: "id,media_id,media_type",
          user_id: `eq.${userId}`,
        },
        headers,
      });

      const myListRecords = response.data ?? [];

      const movieIds = myListRecords
        .filter((item) => item.media_type === "movie")
        .map((item) => item.media_id);

      const seriesIds = myListRecords
        .filter((item) => item.media_type === "series")
        .map((item) => item.media_id);

      let movieData: IMediaRow[] = [];

      if (movieIds.length > 0) {
        const response = await api.get<IMediaRow[]>("/movies", {
          params: {
            select: "id,data",
            id: `in.(${movieIds.join(",")})`,
          },
          headers,
        });

        movieData = response.data ?? [];
      }

      let seriesData: IMediaRow[] = [];

      if (seriesIds.length > 0) {
        const response = await api.get<IMediaRow[]>("/series", {
          params: {
            select: "id,data",
            id: `in.(${seriesIds.join(",")})`,
          },
          headers,
        });

        seriesData = response.data ?? [];
      }

      const allMedia = [
        ...movieData.map((item) => ({
          ...item,
          mediaType: "movie" as const,
        })),
        ...seriesData.map((item) => ({
          ...item,
          mediaType: "series" as const,
        })),
      ];

      const formattedData: IMyListMovie[] = myListRecords
        .map((record) => {
          const media = allMedia.find(
            (item) =>
              item.id === record.media_id &&
              item.mediaType === record.media_type,
          );

          if (!media) return null;

          return {
            ...media.data,
            id: record.media_id,
            myListId: record.id,
            mediaType: record.media_type,
          };
        })
        .filter((item): item is IMyListMovie => item !== null);

      if (currentRequest === requestId) {
        set({ myMovies: formattedData });
      }
    } catch (error) {
      console.error("Gagal mengambil My List:", error);
    }
  },

  // =========================
  // CREATE DAN DELETE
  // =========================

  toggleMyList: async (movie) => {
    if (movie.id == null) return;

    const movieId = String(movie.id);
    const mediaType: "movie" | "series" = movie.type === 1 ? "movie" : "series";
    const pendingKey = `${mediaType}:${movieId}`;

    if (pendingMovies.has(pendingKey)) return;

    pendingMovies.add(pendingKey);

    const existingMovie = get().myMovies.find(
      (item) => String(item.id) === movieId && item.mediaType === mediaType,
    );

    const previousMovies = get().myMovies;

    try {
      // OPTIMISTIC UI

      if (existingMovie) {
        set((state) => ({
          myMovies: state.myMovies.filter(
            (item) => item.myListId !== existingMovie.myListId,
          ),
        }));
      } else {
        const temporaryMovie: IMyListMovie = {
          ...movie,
          id: movieId,
          myListId: `temp-${mediaType}-${movieId}`,
          mediaType,
        };

        set((state) => ({
          myMovies: [...state.myMovies, temporaryMovie],
        }));
      }

      // Memeriksa pengguna yang sedang login

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        throw new Error("Silakan login terlebih dahulu.");
      }

      const headers = await getAuthHeaders();

      // DELETE

      if (existingMovie) {
        await api.delete("/my_list", {
          params: {
            id: `eq.${existingMovie.myListId}`,
            user_id: `eq.${user.id}`,
          },
          headers,
        });
      } else {
        // CREATE

        const response = await api.post<IMyListRecord[]>(
          "/my_list",
          {
            user_id: user.id,
            media_id: movieId,
            media_type: mediaType,
          },
          {
            headers: {
              ...headers,
              Prefer: "return=representation",
            },
          },
        );

        const data = response.data[0];

        if (!data) {
          throw new Error("Gagal mendapatkan ID My List.");
        }

        set((state) => ({
          myMovies: state.myMovies.map((item) =>
            item.myListId === `temp-${mediaType}-${movieId}`
              ? {
                  ...item,
                  myListId: data.id,
                }
              : item,
          ),
        }));
      }
    } catch (error) {
      console.error("Gagal memperbarui My List:", error);

      if (axios.isAxiosError(error)) {
        console.error("Detail Axios:", error.response?.data);
      }

      set({ myMovies: previousMovies });
    } finally {
      pendingMovies.delete(pendingKey);
    }
  },

  // =========================
  // CHECK MY LIST
  // =========================

  isInMyList: (movieId, mediaType) => {
    return get().myMovies.some(
      (item) =>
        String(item.id) === String(movieId) &&
        (!mediaType || item.mediaType === mediaType),
    );
  },
}));
