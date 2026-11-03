import { api } from "../utils/axiosApi";

export interface IUser {
  id?: string;
  username: string;
  password: string;
}

export async function createUser(user: IUser): Promise<IUser> {
  try {
    const response = await api.post<IUser>("/users", user);

    return response.data;
  } catch (error) {
    throw new Error("Gagal mendaftarkan user");
  }
}

export async function loginUser(
  username: string,
  password: string,
): Promise<IUser> {
  try {
    const response = await api.get<IUser[]>("/users", {
      params: {
        username,
        password,
      },
    });

    const users = response.data;

    if (users.length === 0) {
      throw new Error("Username atau password salah");
    }

    return users[0];
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Username atau password salah"
    ) {
      throw error;
    }

    throw new Error("Gagal mengambil data user");
  }
}

export async function checkUsername(username: string): Promise<boolean> {
  try {
    const response = await api.get<IUser[]>("/users", {
      params: {
        username,
      },
    });

    return response.data.length > 0;
  } catch (error) {
    throw new Error("Gagal memeriksa username");
  }
}
