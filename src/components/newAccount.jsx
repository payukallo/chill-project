import { NavLink } from "react-router";

export function NewAccount() {
  return (
    <div className="account body-medium-regular">
      <span>
        Belum punya akun?{" "}
        <NavLink to="/register" className="body-medium-medium">
          Daftar
        </NavLink>
      </span>
      <a href="">Lupa kata sandi?</a>
    </div>
  );
}
