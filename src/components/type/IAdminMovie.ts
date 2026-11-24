export interface IAdminMovie {
  id: number;
  title: string;
  description: string | null;
  rating: number | string;
  year: number | null;
  duration: string | null;
  cover_url: string | null;
  video_url: string | null;
  genre: string[] | null;
  is_premium: number | boolean;
  is_top_10: number | boolean;
  is_top_rating_today: number | boolean;
  film_maker: string | null;
  age_rating: string | null;
  cast_members: string | null;
  banner_url: string | null;
  type?: number | null;
  recommendation_movie_1: number[] | null;
  is_new_episode: number | boolean;
}
