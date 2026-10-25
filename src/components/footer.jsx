import MovieLogo from "../assets/logo/movie.png";
import { RightFoot } from "./rightFoot";
export function Footer() {
  return (
    <footer className="body-medium-medium">
      <div className="foot-logo">
        <img className="logo" src={MovieLogo} alt="" />
        <div>@ 2023 Chill All Rights Reserved.</div>
      </div>
      <RightFoot />
    </footer>
  );
}
