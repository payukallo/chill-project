import MovieLogo from "../assets/logo/movie.png";
import Profile from "../assets/logo/profile.png";
import Profil from "../assets/logo/profil.png";
import Star from "../assets/logo/star.png";
import Exit from "../assets/logo/keluar.png";
import { NavLink } from "react-router";
import { Dropdown } from "../assets/utils/dropdown.ts";

export function Navbar() {
  const { isOpen, setIsOpen, dropdownRef } = Dropdown();

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
        <img src={Profile} />{" "}
        <div className="body-small-medium dropdown-navbar" ref={dropdownRef}>
          <button className="btn-icon" onClick={() => setIsOpen(!isOpen)}>
            V
          </button>
          {isOpen && (
            <div className="dropdown-profile">
              <a href="">
                <img src={Profil} alt="" />
                Profil saya
              </a>
              <a href="">
                <img src={Star} alt="" />
                Ubah Premium
              </a>
              <NavLink to="/login">
                <img src={Exit} alt="" />
                Keluar
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
