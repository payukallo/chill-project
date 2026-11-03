import "../assets/styles/profile.css";
import { useState } from "react";
import { Navbar } from "../layouts/Navbar.jsx";
import { Footer } from "../layouts/Footer.jsx";
import { MyListContainerProfile } from "../components/MyListContainerProfile.js";
import { ProfileContainer } from "../components/ProfileContainer.js";
import { PopUpMyListProfile } from "../components/PopUpMyListProfile.js";
import type { IMyListMovie } from "../stores/useMyListStore";
import { NavLink } from "react-router";
import { useProfile } from "../components/hooks/Profile.js";
import type { IResponseMovie } from "../components/type/IResponMovies.js";

const ProfilePage = () => {
  const {
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
  } = useProfile();

  const [selectedMovie, setSelectedMovie] = useState<IMyListMovie | null>(null);
  const [allMovies] = useState<IResponseMovie[]>([]);

  function handleOpenPopup(movie: IMyListMovie) {
    setSelectedMovie(movie);
  }

  function handleClosePopup() {
    setSelectedMovie(null);
  }

  return (
    <main className="profile-page">
      <Navbar />

      <ProfileContainer
        username={username}
        password={password}
        profileImage={profileImage}
        onPhotoChange={handlePhotoChange}
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

      <div className="my-list-profile">
        <div className="my-list-profile-tittle">
          <span className="list-title heading-3">Daftar Saya</span>
          <NavLink to="/my_list" className="body-large-regular navlink-profile">
            Lihat Semua
          </NavLink>
        </div>
        <MyListContainerProfile onMovieClick={handleOpenPopup} />
      </div>

      {selectedMovie && (
        <PopUpMyListProfile
          movie={selectedMovie}
          onClose={handleClosePopup}
          movies={allMovies}
        />
      )}

      <Footer />
    </main>
  );
};

export default ProfilePage;
