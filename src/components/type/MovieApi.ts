import type { IResponseMovie } from "../type/IResponMovies";

const API_URL_MOVIES = "http://localhost:3000/movies";

export async function getMovies(): Promise<IResponseMovie[]> {
  const response = await fetch(API_URL_MOVIES);

  if (!response.ok) {
    throw new Error("Gagal mengambil data film");
  }

  return response.json();
}


const API_URL_SERIES = "http://localhost:3000/series";

export async function getSeries(): Promise<IResponseMovie[]> {
  const response = await fetch(API_URL_SERIES);

  if (!response.ok) {
    throw new Error("Gagal mengambil data film");
  }

  return response.json();
}