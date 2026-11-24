import { api } from "../components/utils/axiosApi";

import type {
  IAdminSeries,
  IAdminSeriesPayload,
} from "../components/type/IAdminSeries";

const API_URL = "/series";

// GET: Mengambil semua Series
export const getAllAdminSeries = async (): Promise<IAdminSeries[]> => {
  const response = await api.get<IAdminSeries[]>(API_URL);

  return response.data;
};

// GET: Mengambil Series berdasarkan ID
export const getAdminSeriesById = async (id: number): Promise<IAdminSeries> => {
  const response = await api.get<IAdminSeries>(`${API_URL}/${id}`);

  return response.data;
};

// POST: Menambahkan Series
export const createAdminSeries = async (seriesData: IAdminSeriesPayload) => {
  const response = await api.post(API_URL, seriesData);

  return response.data;
};

// PUT: Memperbarui Series
export const updateAdminSeries = async (
  id: number,
  seriesData: IAdminSeriesPayload,
) => {
  const response = await api.put(`${API_URL}/${id}`, seriesData);

  return response.data;
};

// DELETE: Menghapus Series
export const deleteAdminSeries = async (id: number) => {
  const response = await api.delete(`${API_URL}/${id}`);

  return response.data;
};
