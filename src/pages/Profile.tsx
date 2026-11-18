import "../assets/styles/profile.css";
import { useEffect, useState } from "react";
import { Navbar } from "../layouts/Navbar.jsx";
import { Footer } from "../layouts/Footer.jsx";
import { getMovies } from "../components/type/MovieApi";
import { MyListContainerProfile } from "../components/MyListContainerProfile.js";
import { ProfileContainer } from "../components/ProfileContainer.js";
import { PopUpMyListProfile } from "../components/PopUpMyListProfile.js";
import type { IMyListMovie } from "../stores/useMyListStore";
import { NavLink } from "react-router";
import { useProfile } from "../components/hooks/Profile.js";
import {
  getMySubscription,
  type IUserSubscription,
} from "../services/subscriptionService";
import type { IResponseMovie } from "../components/type/IResponMovies.js";

const ProfilePage = () => {
  const {
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
  } = useProfile();

  const [selectedMovie, setSelectedMovie] = useState<IMyListMovie | null>(null);
  const [subscription, setSubscription] = useState<IUserSubscription | null>(
    null,
  );
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState(false);
  const [movies, setMovies] = useState<IResponseMovie[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchSubscription = async () => {
      try {
        const data = await getMySubscription();

        if (!cancelled) {
          setSubscription(data);
        }
      } catch (error) {
        console.error("Gagal mengambil langganan:", error);

        if (!cancelled) {
          setSubscriptionError(true);
        }
      } finally {
        if (!cancelled) {
          setSubscriptionLoading(false);
        }
      }
    };

    fetchSubscription();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await getMovies();
        setMovies(data);
      } catch (error) {
        console.error("Gagal mengambil katalog film:", error);
      }
    }

    fetchMovies();
  }, []);

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
        email={email}
        editEmail={editEmail}
        editOldPassword={editOldPassword}
        oldPassword={oldPassword}
        newPassword={newPassword}
        profileImage={profileImage}
        editUsername={editUsername}
        editPassword={editPassword}
        isSaving={isSaving}
        usernameRef={usernameRef}
        emailRef={emailRef}
        oldPasswordRef={oldPasswordRef}
        newPasswordRef={newPasswordRef}
        onPhotoChange={handlePhotoChange}
        onUsernameChange={setUsername}
        onEmailChange={setEmail}
        onOldPasswordChange={setOldPassword}
        onNewPasswordChange={setNewPassword}
        onEditUsername={handleEditUsername}
        onEditEmail={handleEditEmail}
        onEditOldPassword={handleEditOldPassword}
        onEditPassword={handleEditPassword}
        onSaveProfile={handleSaveProfile}
        onChangePassword={handleChangePassword}
        subscription={subscription}
        subscriptionLoading={subscriptionLoading}
        subscriptionError={subscriptionError}
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
          movies={movies}
          onClose={handleClosePopup}
        />
      )}

      <Footer />
    </main>
  );
};

export default ProfilePage;
