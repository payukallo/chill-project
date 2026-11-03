import type { IResponseMovie } from "../type/IResponMovies";
import { api } from "../utils/axiosApi";

interface IMovieData {
  id: string;
  data: IResponseMovie;
}

export async function getMovies(): Promise<IResponseMovie[]> {
  try {
    const response = await api.get<IMovieData[]>("/movies", {
      params: {
        select: "id,data",
      },
    });

    return response.data.map((item) => item.data);
  } catch (error) {
    console.error("Error mengambil film:", error);
    throw new Error("Gagal mengambil data film");
  }
}

export async function getSeries(): Promise<IResponseMovie[]> {
  try {
    const response = await api.get<IMovieData[]>("/series", {
      params: {
        select: "id,data",
      },
    });

    return response.data.map((item) => item.data);
  } catch (error) {
    console.error("Error mengambil series:", error);
    throw new Error("Gagal mengambil data series");
  }
}
