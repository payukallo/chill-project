import MuteVolume from "../assets/logo/mute-volume.png";
import { createPortal } from "react-dom";

interface IPopUpMovie {
  movieImg: string;
  title: string;
  year: string;
  duration: string;
  movieDescription: string;
  ageRecommendation: string;
  recommendationMovie1: React.ReactNode;
  recommendationMovie2: React.ReactNode;
  recommendationMovie3: React.ReactNode;
  cast: string;
  genre: string;
  filmMaker: string;
  onClose: () => void;
}

export function PopUpMovie(props: IPopUpMovie) {
  const mainElement = document.querySelector(".box-pop-up-content");
  const {
    movieImg,
    title,
    year,
    duration,
    movieDescription,
    ageRecommendation,
    recommendationMovie1,
    recommendationMovie2,
    recommendationMovie3,
    cast,
    genre,
    filmMaker,
    onClose,
  } = props;

  if (!mainElement) {
    return null;
  }
  return createPortal(
    <div className="pop-up-overlay">
      <div className="top-pop-up-container">
        <img src={movieImg} alt="" />
        <div className="top-pop-up">
          <button className="close" onClick={onClose}>
            X
          </button>
          <div className="head-pop-up">
            <span className="pop-up-title heading-3">{title}</span>
            <div className="pop-up-btn">
              <div className="pop-up-btn-left">
                <button className="pop-up-button-left body-medium-bold">
                  Mulai
                </button>
                <button className="add-pop-up text-light-secondary">+</button>
              </div>
              <button id="volume">
                <img src={MuteVolume} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-pop-up">
        <div className="pop-up-description body-medium-regular">
          <div className="description-left">
            <div className="year">
              <span>{year}</span>
              <span>{duration}</span>
              <span className="age-recommendation">{ageRecommendation}</span>
            </div>
            <p>{movieDescription}</p>
          </div>
          <div className="description-right">
            <div className="description-right-list">
              <div className="span-pop-up">
                <span>Cast</span>
                <div>:</div>
              </div>
              <p>{cast}</p>
            </div>
            <div className="description-right-list">
              <div className="span-pop-up">
                <span>Genre</span>
                <div>:</div>
              </div>
              <p>{genre}</p>
            </div>
            <div className="description-right-list">
              <div className="span-pop-up">
                <span>Pembuat Film</span>
                <div>:</div>
              </div>
              <p>{filmMaker}</p>
            </div>
          </div>
        </div>
        <div className="pop-up-recommendation">
          <span className="heading-4">Rekomendasi Film</span>
          <div className="box-recommendation">
            <div className="box">{recommendationMovie1}</div>
            <div className="box">{recommendationMovie2}</div>
            <div className="box">{recommendationMovie3}</div>
          </div>
        </div>
      </div>
    </div>,
    mainElement,
  );
}
