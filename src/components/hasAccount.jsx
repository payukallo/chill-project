import { NavLink } from "react-router";

export function HasAccount() {
  return (
    <div className="account body-medium-regular">
      <span>
        Sudah punya akun?{" "}
        <NavLink to="/login" className="body-medium-medium">
          Masuk
        </NavLink>
      </span>
    </div>
  );
}
