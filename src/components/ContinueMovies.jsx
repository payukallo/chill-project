import Movie1 from "../assets/images/don't-look-up-width.png";
import Movie2 from "../assets/images/all-of-us-are-dead-width.png";
import Movie3 from "../assets/images/blue-lock-width.png";
import Movie4 from "../assets/images/a-man-called-otto-width.png";
import { BoxMovie } from "./BoxMovie";
import { BottomText, NewEpisode } from "./TextMovieImage";

export function ContinueMovies() {

  return (
    <div className="continue-movies">
      <h3 className="heading-3">Melanjutkan Tonton Film</h3>
      <div className="movie-top">
        <div className="box-top">
          <BoxMovie movieImg={Movie1} />
          <BottomText title={"Don't Look Up"} rating={`\u2605 4.5/5`} />
        </div>
        <div className="box-top">
          <BoxMovie movieImg={Movie2} />
          <BottomText title={"All of Us Dead"} rating={`\u2605 4.2/5`} />
        </div>
        <div className="box-top">
          <BoxMovie movieImg={Movie3} newEpisode={<NewEpisode />} />
          <BottomText title={"Blue Lock"} rating={`\u2605 4.6/5`} />
        </div>
        <div className="box-top">
          <BoxMovie movieImg={Movie4} />
          <BottomText title={"A Man Called Otto"} rating={`\u2605 4.4/5`} />
        </div>
        <div className="box-top">
          <BoxMovie movieImg={Movie1} />
          <BottomText title={"Don't Look Up"} rating={`\u2605 4.5/5`} />
        </div>
        <div className="box-top">
          <BoxMovie movieImg={Movie2} />
          <BottomText title={"All of Us Dead"} rating={`\u2605 4.2/5`} />
        </div>
        <div className="box-top">
          <BoxMovie movieImg={Movie3} newEpisode={<NewEpisode />} />
          <BottomText title={"Blue Lock"} rating={`\u2605 4.6/5`} />
        </div>
        <div className="box-top">
          <BoxMovie movieImg={Movie4} />
          <BottomText title={"A Man Called Otto"} rating={`\u2605 4.4/5`} />
        </div>
      </div>
    </div>
  );
}
