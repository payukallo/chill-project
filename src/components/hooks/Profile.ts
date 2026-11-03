import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import axios from "axios";
import { useProfileStore } from "../../stores/useProfileStore";

export function useProfile() {
  // =========================
  // ZUSTAND STORE
  // =========================

  const userId = useProfileStore((state) => state.userId);
  const username = useProfileStore((state) => state.username);
  const profileImage = useProfileStore((state) => state.profileImage);
  const isSaving = useProfileStore((state) => state.isSaving);

  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const saveProfile = useProfileStore((state) => state.saveProfile);
  const uploadProfileImage = useProfileStore(
    (state) => state.uploadProfileImage,
  );

  // =========================
  // LOCAL FORM STATE
  // =========================

  const [password, setPassword] = useState("");
  const [editUsername, setEditUsername] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  // INPUT REF

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // =========================
  // FETCH PROFILE
  // =========================

  useEffect(() => {
    void fetchProfile().catch((error) => {
      console.error("Gagal mengambil profil:", error);
    });
  }, [fetchProfile]);

  // =========================
  // EDIT USERNAME
  // =========================

  function handleEditUsername() {
    setEditUsername(true);

    setTimeout(() => {
      usernameRef.current?.focus();
    }, 0);
  }

  // =========================
  // EDIT PASSWORD
  // =========================

  function handleEditPassword() {
    setEditPassword(true);

    setTimeout(() => {
      passwordRef.current?.focus();
    }, 0);
  }

  // =========================
  // SAVE PROFILE
  // =========================

  async function handleSaveProfile() {
    if (userId === null) return;

    try {
      await saveProfile(username, password);

      setPassword("");
      setEditUsername(false);
      setEditPassword(false);

      alert("Profil berhasil diperbarui!");
    } catch (error) {
      console.error("Gagal memperbarui profil:", error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message,
        );
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Gagal memperbarui profil.");
      }
    }
  }

  // =========================
  // CHANGE PROFILE PHOTO
  // =========================

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar!");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto maksimal 2MB!");
      event.target.value = "";
      return;
    }

    try {
      await uploadProfileImage(file);

      alert("Foto profil berhasil diperbarui!");
    } catch (error) {
      console.error("Gagal mengubah foto profil:", error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message,
        );
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Gagal mengubah foto profil.");
      }
    } finally {
      event.target.value = "";
    }
  }

  // =========================
  // RETURN
  // =========================

  return {
    username,
    password,
    profileImage,
    editUsername,
    editPassword,
    isSaving,
    usernameRef,
    passwordRef,
    setPassword,
    setUsername: useProfileStore.getState().setUsername,
    handleEditUsername,
    handleEditPassword,
    handleSaveProfile,
    handlePhotoChange,
  };
}
