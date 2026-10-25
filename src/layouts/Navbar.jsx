import MovieLogo from "../assets/logo/movie.png";
import Profile from "../assets/logo/profile.png";
import Profil from "../assets/logo/profil.png";
import Star from "../assets/logo/star.png";
import Exit from "../assets/logo/keluar.png";
import { NavLink } from "react-router";

export function Navbar() {
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
        <ul id="account" className="body-small-medium">
          <li>
            <a href="">
              <strong>V</strong>
            </a>
            <ul>
              <li>
                <a href="">
                  <img src={Profil} alt="" />
                  Profil saya
                </a>
              </li>
              <li>
                <a href="">
                  <img src={Star} alt="" />
                  Ubah Premium
                </a>
              </li>
              <li>
                <NavLink to="/login">
                  <img src={Exit} alt="" />
                  Keluar
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}
