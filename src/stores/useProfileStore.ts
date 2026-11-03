import { create } from "zustand";
import axios from "axios";
import { supabase } from "../components/utils/supabase";
import { api } from "../components/utils/axiosApi";
import ProfileImg from "../assets/logo/profile.png";

interface IProfileStore {
  userId: string | null;
  username: string;
  originalUsername: string;
  profileImage: string;
  isSaving: boolean;
  setUsername: (username: string) => void;
  fetchProfile: () => Promise<void>;
  saveProfile: (username: string, password: string) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<void>;
}

interface IProfileResponse {
  username: string;
  avatar_url: string | null;
}

const functionsApi = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_URL,
  headers: {
    apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    "Content-Type": "application/json",
  },
});

async function getAuthHeaders() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;

  if (!session) {
    throw new Error("Session tidak ditemukan. Silakan login kembali.");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}

export const useProfileStore = create<IProfileStore>((set, get) => ({
  userId: null,
  username: "",
  originalUsername: "",
  profileImage: ProfileImg,
  isSaving: false,
  setUsername: (username) => set({ username }),

  // =========================
  // READ PROFILE
  // =========================

  fetchProfile: async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        throw new Error("Pengguna belum login.");
      }

      const headers = await getAuthHeaders();

      const response = await api.get<IProfileResponse[]>("/profiles", {
        params: {
          select: "username,avatar_url",
          id: `eq.${user.id}`,
        },
        headers,
      });

      const profile = response.data[0];

      if (!profile) {
        throw new Error("Data profil tidak ditemukan.");
      }

      set({
        userId: user.id,
        username: profile.username,
        originalUsername: profile.username,
        profileImage: profile.avatar_url || ProfileImg,
      });
    } catch (error) {
      console.error("Gagal mengambil profil:", error);
      throw error;
    }
  },

  // =========================
  // UPDATE PROFILE
  // =========================

  saveProfile: async (username, password) => {
    const { userId, originalUsername } = get();

    if (!userId) {
      throw new Error("Pengguna belum login.");
    }

    const newUsername = username.trim().toLowerCase();

    if (!newUsername) {
      throw new Error("Username tidak boleh kosong.");
    }

    if (password && password.length < 8) {
      throw new Error("Password minimal 8 karakter.");
    }

    if (newUsername === originalUsername && !password) {
      return;
    }

    try {
      set({ isSaving: true });

      const headers = await getAuthHeaders();

      // UPDATE USERNAME

      if (newUsername !== originalUsername) {
        const response = await functionsApi.post(
          "/functions/v1/change-username",
          {
            username: newUsername,
          },
          {
            headers,
          },
        );

        const data = response.data;

        if (!data?.success) {
          throw new Error(data?.error || "Gagal memperbarui username.");
        }

        set({
          username: data.username,
          originalUsername: data.username,
        });
      }

      // UPDATE PASSWORD

      if (password) {
        const { error } = await supabase.auth.updateUser({
          password,
        });

        if (error) throw error;
      }

      // REFRESH SESSION

      const { error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) throw refreshError;
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
  // UPLOAD PROFILE IMAGE
  // =========================

  uploadProfileImage: async (file) => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        throw new Error("Silakan login terlebih dahulu.");
      }

      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `${user.id}/avatar.${extension}`;

      // UPLOAD KE SUPABASE STORAGE

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // MENGAMBIL PUBLIC URL

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatarUrl = publicUrlData.publicUrl;
      const headers = await getAuthHeaders();

      // UPDATE AVATAR URL KE DATABASE

      await api.patch(
        "/profiles",
        {
          avatar_url: avatarUrl,
        },
        {
          params: {
            id: `eq.${user.id}`,
          },
          headers: {
            ...headers,
            Prefer: "return=minimal",
          },
        },
      );

      set({
        profileImage: `${avatarUrl}?t=${Date.now()}`,
      });
    } catch (error) {
      console.error("Gagal mengubah foto profil:", error);

      if (axios.isAxiosError(error)) {
        console.error("Detail Axios:", error.response?.data);
      }

      throw error;
    }
  },
}));
