import Movie1 from "../assets/images/little-mermaid.png";
import Movie2 from "../assets/images/duty-after-school.png";
import Movie3 from "../assets/images/big-hero-5.png";
import Movie4 from "../assets/images/all-of-us-are-dead.png";
import Movie5 from "../assets/images/missing.png";
import { BoxMovie } from "./boxMovie";
import { Premium, Top10 } from "./textMovieImage";

export function SeriesFromChill() {
  return (
    <div className="movies">
      <h3 className="heading-3">Series Persembahan Chill</h3>
      <div className="movie-list">
        <div className="box">
          <BoxMovie movieImg={Movie1} premium={<Premium />} top10={<Top10/>} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie2} premium={<Premium />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie3} premium={<Premium />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie4} premium={<Premium />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie5} premium={<Premium />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie1} premium={<Premium />} top10={<Top10/>} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie2} premium={<Premium />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie3} premium={<Premium />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie4} premium={<Premium />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie5} premium={<Premium />} />
        </div>
      </div>
    </div>
  );
}
