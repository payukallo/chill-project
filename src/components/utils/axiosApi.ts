import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Otomatis mengirim JWT pada setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Menangani sesi login yang sudah tidak valid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const requestUrl = error.config?.url ?? "";

    // Jangan logout karena username/password salah saat login
    const isAuthRequest =
      requestUrl.includes("/users/login") ||
      requestUrl.includes("/users/register");

    // Pastikan request menggunakan JWT sebelum melakukan logout
    const authorization = error.config?.headers?.Authorization;
    const requestToken =
      typeof authorization === "string" && authorization.startsWith("Bearer ")
        ? authorization.slice(7)
        : null;

    const currentToken = localStorage.getItem("token");

    if (
      status === 401 &&
      !isAuthRequest &&
      requestToken &&
      currentToken === requestToken
    ) {
      // Hapus sesi login lama
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Arahkan ke halaman login
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);
