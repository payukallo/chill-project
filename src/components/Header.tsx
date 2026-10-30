import { DropDownHeader } from "./Genre";
import LogoVolume from "../assets/logo/mute-volume.png";
import { IResponseMovie } from "./type/IResponMovies";
import LogoInfo from "../assets/logo/!.png";
interface IHeader {
  movies: IResponseMovie[];
   on_click: (movie: IResponseMovie) => void;
}

export function Header({ movies, on_click }: IHeader) {
  return (
    <header>
      {movies.map((movie) => (
        <>
          <img src={movie.banner_url} alt={movie.title} />
          <div className="header">
            <DropDownHeader />
            <div className="head-bottom">
              <div className="head-text">
                <h1 className="heading-1 head-title">{movie.title}</h1>
                <p className="body-large-medium head-description">
                  {movie.description}
                </p>
              </div>
              <div className="head-btn">
                <div className="btn-left">
                  <button className="btn-primary-shadow">Mulai</button>
                  <button
                    className="btn-secondary-contained info"
                     onClick={() => on_click(movie)}
                  >
                    <img src={LogoInfo} alt="" />
                    Selengkapnya
                  </button>
                  <span className="age body-large-regular">18+</span>
                </div>
                <button id="volume">
                  <img src={LogoVolume} alt="" />
                </button>
              </div>
            </div>
          </div>
        </>
      ))}
    </header>
  );
}
