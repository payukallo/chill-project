export interface IResponseMovie {
  id?: number;
  type: number;
  title?: string;
  cover_url?: string;
  rating?: string;
  is_new_episode?: boolean;
  is_top_10?: boolean;
  year: number;
  duration?: string;
  is_premium?: boolean;
  age?: string;
  description?: string;
  cast: string;
  genre: string[];
  film_maker?: string;
  banner_url?: string;
  top_rating_today?: boolean;
  recommendation_movie_1?: number[];
  on_click?: () => void;
}
