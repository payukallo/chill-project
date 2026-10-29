import MuteVolume from "../assets/logo/mute-volume.png";
import { createPortal } from "react-dom";
import type { IResponseMovie } from "./type/IResponMovies";
import { useEffect, useState } from "react";

interface IPopUpSeries {
  movieId: number;
  onClose: () => void;
}

export function PopUpSeries(props: IPopUpSeries) {
  const { onClose, movieId } = props;
  const [movie, setMovie] = useState<IResponseMovie | null>(null);
  const [activeMovieId, setActiveMovieId] = useState(movieId);
  const [loading, setLoading] = useState(true);

  const mainElement = document.querySelector(".box-pop-up-content");

  useEffect(() => {
    async function fetchMovie() {
      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:3000/series/${activeMovieId}`,
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data movie");
        }

        const data: IResponseMovie = await response.json();

        console.log("URL:", response.url);
        console.log("Data dari API:", data);
        console.log("Judul dari API:", data.title);

        setMovie(data);
      } catch (error) {
        console.error(error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [activeMovieId]);

  if (!mainElement || loading || !movie) {
    return null;
  }

  console.log("ID aktif:", activeMovieId);
  console.log("Film aktif:", movie?.title);

  return createPortal(
    <div className="pop-up-overlay">
      <div className="top-pop-up-container">
        <img src={movie.banner_url ?? ""} alt={movie.title ?? ""} />

        <div className="top-pop-up">
          <button className="close" onClick={onClose}>
            x
          </button>

          <div className="head-pop-up">
            <span className="pop-up-title heading-3">{movie.title}</span>

            <div className="pop-up-btn">
              <div className="pop-up-btn-left">
                <button className="pop-up-button-left body-medium-bold">
                  Mulai
                </button>

                <button className="add-pop-up text-light-secondary">+</button>
              </div>

              <button id="volume">
                <img src={MuteVolume} alt="Volume" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-pop-up">
        <div className="pop-up-description body-medium-regular">
          <div className="description-left">
            <div className="year">
              <span>{movie.year}</span>
              <span>{movie.duration}</span>

              <div className="age-recommendation">
                <span>{movie.age}</span>
              </div>
            </div>

            <p>{movie.description}</p>
          </div>

          <div className="description-right">
            <div className="description-right-list">
              <div className="span-pop-up">
                <span>Cast</span>
              </div>
              <p>: {movie.cast}</p>
            </div>

            <div className="description-right-list">
              <div className="span-pop-up">
                <span>Genre</span>
              </div>
              <p>: {movie.genre}</p>
            </div>

            <div className="description-right-list">
              <div className="span-pop-up">
                <span>Pembuat Film</span>
              </div>
              <p>: {movie.film_maker}</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    mainElement,
  );
}
