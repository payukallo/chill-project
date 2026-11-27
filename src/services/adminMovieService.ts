import { api } from "../components/utils/axiosApi";
import type { IAdminMovie } from "../components/type/IAdminMovie";

const API_URL = "/movies";
const ADMIN_API_URL = `${API_URL}/admin`;

// GET: Mengambil semua Movie khusus Admin
export const getAllAdminMovies = async (): Promise<IAdminMovie[]> => {
  const response = await api.get<IAdminMovie[]>(ADMIN_API_URL);

  return response.data;
};

// GET: Mengambil detail Movie khusus Admin
export const getAdminMovieById = async (id: number): Promise<IAdminMovie> => {
  const response = await api.get<IAdminMovie>(`${ADMIN_API_URL}/${id}`);

  return response.data;
};

// POST: Menambahkan Movie
export const createAdminMovie = async (movieData: Record<string, unknown>) => {
  const response = await api.post(API_URL, movieData);

  return response.data;
};

// PUT: Memperbarui Movie
export const updateAdminMovie = async (
  id: number,
  movieData: Record<string, unknown>,
) => {
  const response = await api.put(`${API_URL}/${id}`, movieData);

  return response.data;
};

// DELETE: Menghapus Movie
export const deleteAdminMovie = async (id: number) => {
  const response = await api.delete(`${API_URL}/${id}`);

  return response.data;
};
