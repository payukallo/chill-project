
import type { IResponseMovie } from "../type/IResponMovies";
import { supabase } from "../utils/supabase";

interface IMovieData {
  id: string;
  data: IResponseMovie;
}

export async function getMovies(): Promise<IResponseMovie[]> {
  const { data, error } = await supabase
    .from("movies")
    .select("id, data");

  if (error) {
    throw new Error(`Gagal mengambil data film: ${error.message}`);
  }

  return (data as IMovieData[]).map((item) => item.data);
}

export async function getSeries(): Promise<IResponseMovie[]> {
  const { data, error } = await supabase
    .from("series")
    .select("id, data");

  if (error) {
    throw new Error(`Gagal mengambil data series: ${error.message}`);
  }

  return (data as IMovieData[]).map((item) => item.data);
}
