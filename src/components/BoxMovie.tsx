import { Dropdown } from "../assets/utils/dropdown";
import { PopUpMovie } from "./PopUpMovie";

interface IBoxMovie {
  movieImg: string;
  isPremium: boolean;
  isTop10: boolean;
  isNewEpisode: boolean;
  title: string;
  rating: string;
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
}

export function BoxMovie(props: IBoxMovie) {
  const {
    title,
    rating,
    movieImg,
    isNewEpisode,
    isPremium,
    isTop10,
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
  } = props;
  const { isOpen, setIsOpen } = Dropdown();
  return (
    <>
      <>
        <img src={movieImg} alt={title} onClick={() => setIsOpen(true)} />
        <div>
          {isPremium && <p className="premium body-small-bold">Premium</p>}
          {isNewEpisode && !isPremium && (
            <p className="new-episode body-small-bold">Episode Baru</p>
          )}
          {isTop10 && <p className="top10 body-small-regular">Top 10</p>}
        </div>
        <div className="bottom-text">
          <p className="heading-6">{title}</p>
          <p className="body-small-regular">{rating}</p>
        </div>
      </>

      {isOpen && (
        <>
          <div className="page-overlay"></div>
          <PopUpMovie
            movieImg={movieImg}
            title={title}
            year={year}
            duration={duration}
            movieDescription={movieDescription}
            ageRecommendation={ageRecommendation}
            recommendationMovie1={recommendationMovie1}
            recommendationMovie2={recommendationMovie2}
            recommendationMovie3={recommendationMovie3}
            cast={cast}
            genre={genre}
            filmMaker={filmMaker}
            onClose={() => setIsOpen(false)}
          />
        </>
      )}
    </>
  );
}
