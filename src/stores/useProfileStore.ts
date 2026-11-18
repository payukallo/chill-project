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
          ? `${user.avatar_url}?t=${Date.now()}`
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
        profileImage: `${avatarUrl}?t=${Date.now()}`,
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
