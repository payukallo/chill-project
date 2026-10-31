import type { IResponseMovie } from "../type/IResponMovies";


const API_URL_MOVIES = import.meta.env.VITE_API_MOVIES_URL;

export async function getMovies(): Promise<IResponseMovie[]> {
  const response = await fetch(API_URL_MOVIES, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Gagal mengambil data film");
  }
  return response.json();
}


const API_URL_SERIES = import.meta.env.VITE_API_SERIES_URL;

export async function getSeries(): Promise<IResponseMovie[]> {
  const response = await fetch(API_URL_SERIES, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Gagal mengambil data series");
  }
  return response.json();
}


