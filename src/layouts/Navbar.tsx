import MovieLogo from "../assets/logo/movie.png";
import Profile from "../assets/logo/profile.png";
import Star from "../assets/logo/star.png";
import Exit from "../assets/logo/keluar.png";
import { NavLink } from "react-router";
import { Dropdown } from "../components/utils/dropdown.ts";
import { logoutUser } from "../components/ProtectedRoute.tsx";
import { useEffect } from "react";
import { useProfileStore } from "../stores/useProfileStore";

export function Navbar() {
  const { isOpen, setIsOpen, dropdownRef } = Dropdown();

  // Ambil foto profil dari Zustand
  const profileImage = useProfileStore((state) => state.profileImage);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  // Ambil data profil dari backend ketika Navbar pertama kali dibuka
  useEffect(() => {
    void fetchProfile().catch((error) => {
      console.error("Gagal mengambil foto profil Navbar:", error);
    });
  }, [fetchProfile]);

  return (
    <nav className="body-large-medium">
      <div className="navbar">
        <NavLink to="/">
          <img className="logo" src={MovieLogo} width={163} height={44} />
        </NavLink>

        <NavLink to="/series">Series</NavLink>
        <NavLink to="/movies">Film</NavLink>
        <NavLink to="/my_list">Daftar Saya</NavLink>
      </div>

      <div className="profile">
        <img
          className="navbar-img"
          src={profileImage || Profile}
          alt="Foto profil"
        />

        <div className="body-small-medium dropdown-navbar" ref={dropdownRef}>
          <button className="btn-icon" onClick={() => setIsOpen(!isOpen)}>
            V
          </button>

          {isOpen && (
            <div className="dropdown-profile">
              <NavLink to="/profile">
                <img
                  className="navbar-profile-image"
                  src={Profile}
                  alt="Foto profil"
                />
                Profil saya
              </NavLink>

              <NavLink to="/subscription">
                <img src={Star} alt="" />
                Ubah Premium
              </NavLink>

              <button onClick={logoutUser}>
                <img src={Exit} alt="" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
