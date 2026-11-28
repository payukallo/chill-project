import { create } from "zustand";
import axios from "axios";
import { api } from "../components/utils/axiosApi";
import ProfileImg from "../assets/logo/profile.png";

interface IProfileStore {
  userId: number | null;
  username: string;
  email: string;
  originalUsername: string;
  originalEmail: string;
  profileImage: string;
  isSaving: boolean;

  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (username: string, email: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<void>;
}

interface IProfileResponse {
  status: string;
  user: {
    id: number;
    username: string;
    email: string;
    avatar_url: string | null;
    role: "admin" | "user";
    created_at: string;
  };
}

interface IAvatarResponse {
  status: string;
  message: string;
  avatar_url: string;
}

// Avatar R2 menggunakan UUID baru setiap penggantian foto.
// Avatar legacy tetap menggunakan cache busting.
function formatAvatarUrl(avatarUrl: string): string {
  try {
    const url = new URL(avatarUrl);

    if (
      url.protocol === "https:" &&
      /^\/images\/avatars\/[1-9]\d*\/[0-9a-f-]{36}\.webp$/.test(
        url.pathname
      ) &&
      !url.search
    ) {
      return avatarUrl;
    }

    url.searchParams.set("t", String(Date.now()));
    return url.toString();
  } catch {
    return avatarUrl;
  }
}

export const useProfileStore = create<IProfileStore>((set, get) => ({
  userId: null,
  username: "",
  email: "",
  originalUsername: "",
  originalEmail: "",
  profileImage: ProfileImg,
  isSaving: false,

  setUsername: (username) => set({ username }),
  setEmail: (email) => set({ email }),

  // =========================
  // READ PROFILE
  // =========================

  fetchProfile: async () => {
    try {
      const response = await api.get<IProfileResponse>("/users/profile");

      const user = response.data.user;

      if (!user) {
        throw new Error("Data profil tidak ditemukan.");
      }

      set({
        userId: user.id,
        username: user.username,
        email: user.email,
        originalUsername: user.username,
        originalEmail: user.email,
        profileImage: user.avatar_url
          ? formatAvatarUrl(user.avatar_url)
          : ProfileImg,
      });
    } catch (error) {
      console.error("Gagal mengambil profil:", error);
      throw error;
    }
  },

  // =========================
  // UPDATE PROFILE
  // =========================

  updateProfile: async (username, email) => {
    const { userId } = get();

    if (userId === null) {
      throw new Error("Pengguna belum login.");
    }

    const newUsername = username.trim().toLowerCase();
    const newEmail = email.trim().toLowerCase();

    if (!newUsername || !newEmail) {
      throw new Error("Username dan email wajib diisi.");
    }

    try {
      set({ isSaving: true });

      const response = await api.patch<IProfileResponse>("/users/profile", {
        username: newUsername,
        email: newEmail,
      });

      const updatedUser = response.data.user;

      set({
        username: updatedUser.username,
        email: updatedUser.email,
        originalUsername: updatedUser.username,
        originalEmail: updatedUser.email,
      });
    } catch (error) {
      console.error("Gagal memperbarui profil:", error);

      if (axios.isAxiosError(error)) {
        console.error("Detail Axios:", error.response?.data);
      }

      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  // =========================
  // CHANGE PASSWORD
  // =========================

  changePassword: async (oldPassword, newPassword) => {
    if (!oldPassword || !newPassword) {
      throw new Error("Password lama dan password baru wajib diisi.");
    }

    if (newPassword.length < 8) {
      throw new Error("Password baru minimal 8 karakter.");
    }

    if (!/[A-Z]/.test(newPassword)) {
      throw new Error("Kata sandi harus memiliki minimal 1 huruf besar!");
    }

    if (!/[a-z]/.test(newPassword)) {
      throw new Error("Kata sandi harus memiliki minimal 1 huruf kecil!");
    }

    if (!/[0-9]/.test(newPassword)) {
      throw new Error("Kata sandi harus memiliki minimal 1 angka!");
    }

    if (!/[^A-Za-z0-9\s]/.test(newPassword)) {
      throw new Error(
        "Kata sandi harus memiliki minimal 1 simbol, seperti @, #, !, atau $!",
      );
    }

    try {
      set({ isSaving: true });

      await api.patch("/users/change-password", {
        oldPassword,
        newPassword,
      });
    } catch (error) {
      console.error("Gagal mengubah password:", error);

      if (axios.isAxiosError(error)) {
        console.error("Detail Axios:", error.response?.data);
      }

      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  // =========================
  // UPLOAD PROFILE IMAGE
  // =========================

  uploadProfileImage: async (file) => {
    if (get().isSaving) {
      throw new Error("Proses penyimpanan masih berlangsung.");
    }

    try {
      const userId = get().userId;

      if (userId === null) {
        throw new Error("Silakan login terlebih dahulu.");
      }

      const formData = new FormData();

      formData.append("avatar", file);

      set({ isSaving: true });

      const response = await api.patch<IAvatarResponse>(
        "/users/profile/avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const avatarUrl = response.data.avatar_url;

      set({
        profileImage: formatAvatarUrl(avatarUrl),
      });
    } catch (error) {
      console.error("Gagal mengubah foto profil:", error);

      if (axios.isAxiosError(error)) {
        console.error("Detail Axios:", error.response?.data);
      }

      throw error;
    } finally {
      set({ isSaving: false });
    }
  },
}));
