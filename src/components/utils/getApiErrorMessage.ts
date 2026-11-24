import axios from "axios";

interface ApiErrorResponse {
  message?: string;
  status?: string;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Terjadi kesalahan",
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const serverMessage = error.response?.data?.message;

    if (serverMessage) {
      return serverMessage;
    }

    if (!error.response) {
      return "Tidak dapat terhubung ke server. Periksa koneksi.";
    }

    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
