
import "../assets/styles/profile.css";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "../layouts/Navbar.jsx";
import { Footer } from "../layouts/Footer.jsx";
import type { IResponseMovie } from "../components/type/IResponMovies.js";
import { PopUpMyList } from "../components/PopUpMyList.js";
import { MyListContainerProfile } from "../components/MyListContainerProfile.js";
import { ProfileContainer } from "../components/ProfileContainer.js";
import { NavLink } from "react-router";

interface IUser {
  id: string | number;
  username: string;
  password: string;
}

const Profile = () => {
  const [userId, setUserId] = useState<string | number | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const [editUsername, setEditUsername] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [selectedMovie, setSelectedMovie] =
    useState<IResponseMovie | null>(null);

const API_USERS = import.meta.env.VITE_API_USERS_URL;

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUsername = localStorage.getItem("username");

        if (!currentUsername) {
          throw new Error("Pengguna belum login");
        }

        const response = await fetch(
          `${API_USERS}?username=${encodeURIComponent(currentUsername)}`
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data pengguna");
        }

        const data: IUser[] = await response.json();

        if (data.length === 0) {
          throw new Error("Data pengguna tidak ditemukan");
        }

        const user = data[0];

        setUserId(user.id);
        setUsername(user.username);
        setPassword(user.password);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUser();
  }, []);

  // ==============================
  // EDIT USERNAME
  // ==============================

  function handleEditUsername() {
    setEditUsername(true);

    setTimeout(() => {
      usernameRef.current?.focus();
    }, 0);
  }

  // ==============================
  // EDIT PASSWORD
  // ==============================

  function handleEditPassword() {
    setEditPassword(true);

    setTimeout(() => {
      passwordRef.current?.focus();
    }, 0);
  }

  // ==============================
  // SAVE PROFILE
  // ==============================

  async function handleSaveProfile() {
    if (userId === null) return;

    if (!username.trim() || !password.trim()) {
      alert("Username dan password tidak boleh kosong");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(
        `VITE_API_USERS_URL${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal memperbarui profil");
      }

      // Update username di localStorage
      localStorage.setItem("username", username.trim());

      // Menonaktifkan mode edit
      setEditUsername(false);
      setEditPassword(false);

      alert("Profil berhasil diperbarui!");
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui profil");
    } finally {
      setIsSaving(false);
    }
  }

  function handleOpenPopup(movie: IResponseMovie) {
    setSelectedMovie(movie);
  }

  function handleClosePopup() {
    setSelectedMovie(null);
  }

  return (
    <main className="profile-page">
      <Navbar />

      {/* PROFILE CONTAINER */}
      <ProfileContainer
        username={username}
        password={password}
        editUsername={editUsername}
        editPassword={editPassword}
        isSaving={isSaving}
        usernameRef={usernameRef}
        passwordRef={passwordRef}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onEditUsername={handleEditUsername}
        onEditPassword={handleEditPassword}
        onSave={handleSaveProfile}
      />

      {/* MY LIST */}
      <div className="my-list-profile">
        <div className="my-list-profile-tittle">
          <span className="list-title heading-3">
            Daftar Saya
          </span>

          <NavLink to="/my_list">
            Lihat Semua
          </NavLink>
        </div>

        <MyListContainerProfile
          onMovieClick={handleOpenPopup}
        />
      </div>

      {/* POPUP */}
      {selectedMovie && (
        <PopUpMyList
          movie={selectedMovie}
          onClose={handleClosePopup}
        />
      )}

      <Footer />
    </main>
  );
};

export default Profile;
