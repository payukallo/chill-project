import MovieLogo from "../assets/logo/movie.png";

export function Logo() {
  return (
    <div className="logo">
      <img id="logo" src={MovieLogo} width={163} height={44} />
    </div>
  );
}
