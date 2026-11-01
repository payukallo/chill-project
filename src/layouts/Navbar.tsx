import MovieLogo from "../assets/logo/movie.png";
import Profile from "../assets/logo/profile.png";
import Star from "../assets/logo/star.png";
import Exit from "../assets/logo/keluar.png";
import { NavLink } from "react-router";
import { Dropdown } from "../components/utils/dropdown.ts";
import { logoutUser } from "../components/ProtectedRoute.tsx";
import { useEffect, useState } from "react";
import { supabase } from "../components/utils/supabase.ts";

export function Navbar() {
  const { isOpen, setIsOpen, dropdownRef } = Dropdown();
  const [profileImage, setProfileImage] = useState(Profile);

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
          setProfileImage(`${data.avatar_url}?t=${Date.now()}`);
        }
      } catch (error) {
        console.error("Gagal mengambil foto profil Navbar:", error);
      }
    }

    fetchProfileImage();
  }, []);

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
        <img className="navbar-img" src={profileImage} />{" "}
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
              <a href="">
                <img src={Star} alt="" />
                Ubah Premium
              </a>
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
