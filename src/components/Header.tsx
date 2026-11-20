import { DropDownHeader } from "./Genre";
import LogoVolume from "../assets/logo/mute-volume.png";
import LogoInfo from "../assets/logo/!.png";
import type { IResponseMovie } from "./type/IResponMovies";
import type { IWatchHistory } from "./type/WatchHistoryApi";
import { useSeriesContinuePlay } from "./hooks/useSeriesContinuePlay";
import { useWatchMovie } from "./hooks/useWatchMovie";

interface IHeader {
  movies: IResponseMovie[];
  on_click: (movie: IResponseMovie) => void;
  history?: IWatchHistory[];
  historyLoading?: boolean;
}

export function Header({
  movies,
  on_click,
  history = [],
  historyLoading = false,
}: IHeader) {
  const currentMovie = movies[0];

  const { handleWatchSeries } = useSeriesContinuePlay({
    movie: currentMovie,
    history,
  });

  const { handleWatchMovie } = useWatchMovie(currentMovie);

  return (
    <>
      {movies.map((item) => (
        <header key={`${item.type}-${item.id}`}>
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
                    type="button"
                    disabled={item.type === 1 && historyLoading}
                    onClick={
                      item.type === 1 ? handleWatchSeries : handleWatchMovie
                    }
                  >
                    Mulai
                  </button>

                  <button
                    className="btn-secondary-contained info"
                    type="button"
                    onClick={() => on_click(item)}
                  >
                    <img src={LogoInfo} alt="" />
                    Selengkapnya
                  </button>

                  <span className="age body-large-regular">
                    {item.age_rating}
                  </span>
                </div>

                <button id="volume" type="button">
                  <img src={LogoVolume} alt="" />
                </button>
              </div>
            </div>
          </div>
        </header>
      ))}
    </>
  );
}
