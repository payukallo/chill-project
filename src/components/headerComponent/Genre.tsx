import { NavLink } from "react-router";
import { Dropdown } from "../../assets/utils/dropdown";

export function DropDownHeader() {
  const { isOpen, setIsOpen, dropdownRef } = Dropdown();

  return (
    <div className="body-medium-bold dropdown-header" ref={dropdownRef}>
      <button className="btn-header" onClick={() => setIsOpen(!isOpen)}>
        <div>Genre &ensp;<strong>v</strong></div>
      </button>
      {isOpen && (
        <div className="dropdown-genre body-small-medium">
          <NavLink to="/login">Aksi</NavLink>
          <NavLink to="/login">Anak-anak</NavLink>
          <NavLink to="/login">Anime</NavLink>
          <NavLink to="/login">Britania</NavLink>
          <NavLink to="/login">Drama</NavLink>
          <NavLink to="/login">Fantasi Ilmiah & Fantasi</NavLink>
          <NavLink to="/login">Kejahatan</NavLink>
          <NavLink to="/login">KDrama</NavLink>
          <NavLink to="/login">Komedi</NavLink>
          <NavLink to="/login">Petualangan</NavLink>
          <NavLink to="/login">Perang</NavLink>
          <NavLink to="/login">Romantis</NavLink>
          <NavLink to="/login">Sains & Alam</NavLink>
          <NavLink to="/login">Thriller</NavLink>
        </div>
      )}
    </div>
  );
}
