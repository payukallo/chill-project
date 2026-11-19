import type { IResponseMovie } from "../type/IResponMovies";
import { api } from "../utils/axiosApi";

export async function getMovies(): Promise<IResponseMovie[]> {
  try {
    const response = await api.get<
      {
        id: number;
        title: string;
        description: string | null;
        rating: string | number;
        year: number | null;
        duration: string | null;
        cover_url: string | null;
        banner_url: string | null;
        recommendation_movie_1: number[] | null;
        video_url: string | null;
        genre: string[] | null;
        is_premium: number;
        is_top_10: number;
        is_top_rating_today: number;
        film_maker: string | null;
        age_rating: string | null;
        cast_members: string | null;
      }[]
    >("/movies");

    return response.data.map((item) => ({
      id: item.id,
      type: 0,
      title: item.title,
      video_url: item.video_url ?? null,
      description: item.description ?? "",
      rating: String(item.rating),
      year: item.year ?? 0,
      duration: item.duration ?? "",
      cover_url: item.cover_url ?? undefined,
      banner_url: item.banner_url ?? undefined,
      recommendation_movie_1: item.recommendation_movie_1 ?? [],
      genre: item.genre ?? [],
      is_premium: Boolean(item.is_premium),
      is_top_10: Boolean(item.is_top_10),
      top_rating_today: Boolean(item.is_top_rating_today),
      film_maker: item.film_maker ?? undefined,
      age_rating: item.age_rating ?? undefined,
      cast: item.cast_members ?? "",
    }));
  } catch (error) {
    console.error("Error mengambil movies:", error);
    throw new Error("Gagal mengambil data movies");
  }
}

export async function getSeries(): Promise<IResponseMovie[]> {
  try {
    const response = await api.get<
      {
        id: number;
        title: string;
        description: string | null;
        rating: string | number;
        year: number | null;
        cover_url: string | null;
        banner_url: string | null;
        genre: string[] | null;
        is_premium: number;
        is_top_10: number;
        is_top_rating_today: number;
        film_maker: string | null;
        age_rating: string | null;
        cast_members: string | null;
        is_new_episode: number;
        duration: string | null;
        episodes: IResponseMovie["episodes"] | null;
      }[]
    >("/series");

    return response.data.map((item) => ({
      id: item.id,
      type: 1,
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
      top_rating_today: Boolean(item.is_top_rating_today),
      is_new_episode: Boolean(item.is_new_episode),
      film_maker: item.film_maker ?? undefined,
      age_rating: item.age_rating ?? undefined,
      cast: item.cast_members ?? "",
      episodes: item.episodes ?? [],
    }));
  } catch (error) {
    console.error("Error mengambil series:", error);
    throw new Error("Gagal mengambil data series");
  }
}
