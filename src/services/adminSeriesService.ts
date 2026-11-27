import { api } from "../components/utils/axiosApi";

import type {
  IAdminSeries,
  IAdminSeriesPayload,
} from "../components/type/IAdminSeries";

const API_URL = "/series";
const ADMIN_API_URL = `${API_URL}/admin`;

// GET: Mengambil semua Series khusus Admin
export const getAllAdminSeries = async (): Promise<IAdminSeries[]> => {
  const response = await api.get<IAdminSeries[]>(ADMIN_API_URL);

  return response.data;
};

// GET: Mengambil detail Series khusus Admin
export const getAdminSeriesById = async (id: number): Promise<IAdminSeries> => {
  const response = await api.get<IAdminSeries>(`${ADMIN_API_URL}/${id}`);

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
