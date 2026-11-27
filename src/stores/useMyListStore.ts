import { create } from "zustand";
import axios from "axios";
import type { IResponseMovie } from "../components/type/IResponMovies";
import { api } from "../components/utils/axiosApi";

export interface IMyListMovie extends Omit<IResponseMovie, "id"> {
  id: string;
  myListId: string;
  mediaType: "movie" | "series";
}

interface IMyListStore {
  myMovies: IMyListMovie[];

  setMyMovies: (movies: IMyListMovie[]) => void;
  fetchMyList: () => Promise<void>;
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
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Silakan login terlebih dahulu.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export const useMyListStore = create<IMyListStore>((set, get) => ({
  myMovies: [],

  setMyMovies: (movies) => set({ myMovies: movies }),

  // =========================
  // READ MY LIST
  // =========================

  fetchMyList: async () => {
    const currentRequest = ++requestId;

    try {
      const headers = await getAuthHeaders();

      const response = await api.get<{
        message: string;
        data: Array<{
          my_list_id: number;
          media_id: number;
          media_type: "movie" | "series";
          created_at: string;
          title: string;
          cover_url: string | null;
          rating: string;
          year: number;
          is_premium: number;
          is_top_10: number;
          top_rating_today: number;
          is_new_episode: number;
          description: string | null;
          duration: string | null;
          banner_url: string | null;
          genre: string[] | null;
          film_maker: string | null;
          age_rating: string | null;
          cast_members: string | null;
          episodes: IMyListMovie["episodes"] | null;
          recommendation_movie_1: number[] | null;
        }>;
      }>("/my-list", { headers });

      const formattedData: IMyListMovie[] = response.data.data.map(
        (item) =>
          ({
            id: String(item.media_id),
            myListId: String(item.my_list_id),
            mediaType: item.media_type,
            type: item.media_type === "movie" ? 0 : 1,
            title: item.title,
            description: item.description ?? "",
            rating: String(item.rating),
            year: item.year ?? 0,
            duration: item.duration ?? "",
            cover_url: item.cover_url ?? undefined,
            banner_url: item.banner_url ?? undefined,
            genre: item.genre ?? [],
            is_premium: Boolean(item.is_premium),
            is_top_10: Boolean(item.is_top_10),
            top_rating_today: Boolean(item.top_rating_today),
            is_new_episode: Boolean(item.is_new_episode),
            film_maker: item.film_maker ?? undefined,
            age_rating: item.age_rating ?? undefined,
            cast: item.cast_members ?? "",
            episodes: item.episodes ?? [],
            recommendation_movie_1: item.recommendation_movie_1 ?? [],
          }) as IMyListMovie,
      );

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

    const mediaType: "movie" | "series" =
      "mediaType" in movie
        ? movie.mediaType
        : movie.type === 0
          ? "movie"
          : "series";

    const pendingKey = `${mediaType}:${movieId}`;

    if (pendingMovies.has(pendingKey)) return;

    pendingMovies.add(pendingKey);

    const existingMovie = get().myMovies.find(
      (item) => String(item.id) === movieId && item.mediaType === mediaType,
    );

    const previousMovies = get().myMovies;

    try {
      const headers = await getAuthHeaders();

      if (existingMovie) {
        set((state) => ({
          myMovies: state.myMovies.filter(
            (item) => item.myListId !== existingMovie.myListId,
          ),
        }));

        await api.delete("/my-list", {
          data: {
            mediaId: Number(movieId),
            mediaType: mediaType,
          },
          headers,
        });
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

        await api.post(
          "/my-list",
          {
            mediaId: Number(movieId),
            mediaType: mediaType,
          },
          { headers },
        );

        await get().fetchMyList();
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
