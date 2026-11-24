export interface IAdminEpisode {
  episode_id?: number;
  episode_number: number;
  title: string;
  description: string | null;
  duration: string | null;
  thumbnail: string | null;
  video_url: string | null;
}

export interface IAdminSeries {
  id: number;
  title: string;
  description: string | null;
  rating: number | string;
  year: number | null;
  cover_url: string | null;
  banner_url: string | null;
  is_premium: number | boolean;
  is_top_10: number | boolean;
  is_top_rating_today: number | boolean;
  film_maker: string | null;
  age_rating: string | null;
  cast_members: string | null;
  is_new_episode: number | boolean;

  // Data khusus frontend
  type: number;
  genre: string[];
  duration: string;
  episodes: IAdminEpisode[];
}

export type IAdminSeriesPayload = Omit<
  IAdminSeries,
  "id" | "type" | "duration" | "episodes"
> & {
  episodes: Omit<IAdminEpisode, "episode_id">[];
};
