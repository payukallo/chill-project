import { useEffect, useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { supabase } from "../utils/supabase.js";
import ProfileImg from "../../assets/logo/profile.png";

export function useProfile() {
  // State profil
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");

  // State edit profil
  const [editUsername, setEditUsername] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // State foto profil
  const [profileImage, setProfileImage] = useState(ProfileImg);

  // Ref input
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Mengambil data pengguna
  useEffect(() => {
    async function fetchUser() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          throw new Error("Pengguna belum login");
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setUserId(user.id);
        setUsername(data.username);
        setOriginalUsername(data.username);
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      }
    }

    fetchUser();
  }, []);

  // Mengambil foto profil
  useEffect(() => {
    async function fetchProfileImage() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data.avatar_url) {
          setProfileImage(data.avatar_url);
        }
      } catch (error) {
        console.error("Gagal mengambil foto profil:", error);
      }
    }

    fetchProfileImage();
  }, []);

  // Mengaktifkan edit username
  function handleEditUsername() {
    setEditUsername(true);

    setTimeout(() => {
      usernameRef.current?.focus();
    }, 0);
  }

  // Mengaktifkan edit password
  function handleEditPassword() {
    setEditPassword(true);

    setTimeout(() => {
      passwordRef.current?.focus();
    }, 0);
  }

  // Menyimpan perubahan profil
  async function handleSaveProfile() {
    if (userId === null) return;

    if (!username.trim()) {
      alert("Username tidak boleh kosong");
      return;
    }

    const newUsername = username.trim().toLowerCase();
    const newPassword = password;

    if (newPassword && newPassword.length < 8) {
      alert("Password minimal 8 karakter");
      return;
    }

    if (newUsername === originalUsername && !newPassword) {
      setEditUsername(false);
      setEditPassword(false);
      return;
    }

    try {
      setIsSaving(true);

      // Update username melalui Edge Function
      if (newUsername !== originalUsername) {
        const { data, error } = await supabase.functions.invoke(
          "change-username",
          {
            body: {
              username: newUsername,
            },
          },
        );

        if (error) throw error;

        if (!data?.success) {
          throw new Error(data?.error || "Gagal memperbarui username");
        }

        setUsername(data.username);
        setOriginalUsername(data.username);
      }

      // Update password
      if (newPassword) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) throw error;
      }

      // Refresh session
      await supabase.auth.refreshSession();

      setPassword("");
      setEditUsername(false);
      setEditPassword(false);

      alert("Profil berhasil diperbarui!");
    } catch (error) {
      console.error("Gagal memperbarui profil:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Gagal memperbarui profil");
      }
    } finally {
      setIsSaving(false);
    }
  }

  // Mengunggah foto profil
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

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatarUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setProfileImage(`${avatarUrl}?t=${Date.now()}`);

      alert("Foto profil berhasil diperbarui!");
    } catch (error) {
      console.error("Gagal mengubah foto profil:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Gagal mengubah foto profil.");
      }
    } finally {
      event.target.value = "";
    }
  }

  // Mengembalikan state dan function
  return {
    username,
    password,
    profileImage,
    editUsername,
    editPassword,
    isSaving,

    usernameRef,
    passwordRef,

    setUsername,
    setPassword,

    handleEditUsername,
    handleEditPassword,
    handleSaveProfile,
    handlePhotoChange,
  };
}
