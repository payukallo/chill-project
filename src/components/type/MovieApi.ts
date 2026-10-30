import type { IResponseMovie } from "../type/IResponMovies";


const API_URL_MOVIES = "http://localhost:3000/movies";

export async function getMovies(): Promise<IResponseMovie[]> {
  const response = await fetch(API_URL_MOVIES, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Gagal mengambil data film");
  }
  return response.json();
}


const API_URL_SERIES = "http://localhost:3000/series";

export async function getSeries(): Promise<IResponseMovie[]> {
  const response = await fetch(API_URL_SERIES, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Gagal mengambil data series");
  }
  return response.json();
}


const API_URL_USERS = "http://localhost:3000/users";

export async function createUser(user: IUser): Promise<IUser> {
  const response = await fetch(API_URL_USERS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Gagal mendaftarkan user");
  }
  return response.json();
}


export interface IUser {
  id?: string;
  username: string;
  password: string;
}

export async function loginUser(
  username: string,
  password: string,
): Promise<IUser> {
  const response = await fetch(
    `${API_URL_USERS}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
    {
      method: "GET",
    },
  );
  if (!response.ok) {
    throw new Error("Gagal mengambil data user");
  }

  const users: IUser[] = await response.json();
  if (users.length === 0) {
    throw new Error("Username atau password salah");
  }

  return users[0];
}

export async function checkUsername(username: string): Promise<boolean> {
  const response = await fetch(
    `${API_URL_USERS}?username=${encodeURIComponent(username)}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error("Gagal memeriksa username");
  }

  const users = await response.json();
  return users.length > 0;
}
