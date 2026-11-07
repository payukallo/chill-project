import { DropDownHeader } from "./Genre";
import LogoVolume from "../assets/logo/mute-volume.png";
import type { IResponseMovie } from "./type/IResponMovies";
import LogoInfo from "../assets/logo/!.png";

interface IHeader {
  movie?: IResponseMovie;
  movies: IResponseMovie[];
  on_click: (movie: IResponseMovie) => void;
}

export function Header({ movies, on_click }: IHeader) {

  function handleWatchMedia(item: IResponseMovie) {
    const mediaType = item.type === 1 ? "movie" : "series";

    window.open(
      `/watch/${item.id}?type=${mediaType}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <header>
      {movies.map((item) => (
        <>
          <img src={item.banner_url} alt={item.title} />
          <div className="header">
            <DropDownHeader />
            <div className="head-bottom">
              <div className="head-text">
                <h1 className="heading-1 head-title">{item.title}</h1>
                <p className="body-large-medium head-description">
                  {item.description}
                </p>
              </div>
              <div className="head-btn">
                <div className="btn-left">
                  <button
                    className="btn-primary-shadow"
                    onClick={() => handleWatchMedia(item)}
                  >
                    Mulai
                  </button>
                  <button
                    className="btn-secondary-contained info"
                    onClick={() => on_click(item)}
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

