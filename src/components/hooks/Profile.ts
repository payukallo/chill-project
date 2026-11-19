import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import axios from "axios";
import { useProfileStore } from "../../stores/useProfileStore";

export function useProfile() {
  // Zustand
  const username = useProfileStore((state) => state.username);
  const email = useProfileStore((state) => state.email);
  const profileImage = useProfileStore((state) => state.profileImage);
  const isSaving = useProfileStore((state) => state.isSaving);
  const setUsername = useProfileStore((state) => state.setUsername);
  const setEmail = useProfileStore((state) => state.setEmail);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const changePassword = useProfileStore((state) => state.changePassword);
  const uploadProfileImage = useProfileStore(
    (state) => state.uploadProfileImage,
  );

  // Local form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editOldPassword, setEditOldPassword] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);

  // Ambil profil ketika halaman dibuka
  useEffect(() => {
    void fetchProfile().catch((error) => {
      console.error("Gagal mengambil profil:", error);
    });
  }, [fetchProfile]);

  function handleEditUsername() {
    setEditUsername(true);
    setTimeout(() => {
      usernameRef.current?.focus();
    }, 0);
  }

  function handleEditEmail() {
    setEditEmail(true);

    setTimeout(() => {
      emailRef.current?.focus();
    }, 0);
  }

  function handleEditOldPassword() {
    setEditOldPassword(true);
    setEditPassword(true);

    setTimeout(() => {
      oldPasswordRef.current?.focus();
    }, 0);
  }

  function handleEditPassword() {
    setEditPassword(true);

    setTimeout(() => {
      newPasswordRef.current?.focus();
    }, 0);
  }

  // Simpan username dan email
  async function handleSaveProfile() {
    try {
      await updateProfile(username, email);

      setEditUsername(false);

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

  // Ubah password
  async function handleChangePassword() {
    try {
      await changePassword(oldPassword, newPassword);

      setOldPassword("");
      setNewPassword("");
      setEditPassword(false);

      alert("Password berhasil diperbarui!");
    } catch (error) {
      console.error("Gagal mengubah password:", error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message,
        );
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Gagal mengubah password.");
      }
    }
  }

  // Upload foto profil
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

  return {
    username,
    email,
    oldPassword,
    newPassword,
    profileImage,
    editUsername,
    editEmail,
    editOldPassword,
    editPassword,
    isSaving,
    usernameRef,
    emailRef,
    oldPasswordRef,
    newPasswordRef,

    setUsername,
    setEmail,
    setOldPassword,
    setNewPassword,
    handleEditUsername,
    handleEditEmail,
    handleEditOldPassword,
    handleEditPassword,
    handleSaveProfile,
    handleChangePassword,
    handlePhotoChange,
  };
}
