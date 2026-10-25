import Movie1 from "../assets/images/the-tomorrow-war.png";
import Movie2 from "../assets/images/quantumania.png";
import Movie3 from "../assets/images/guardians-of-the-galaxy.png";
import Movie4 from "../assets/images/a-man-called-otto.png";
import Movie5 from "../assets/images/little-mermaid.png";
import { BoxMovie } from "./boxMovie";
import { Top10 } from "./textMovieImage";

export function Trending() {
  return (
    <div className="movies">
      <h3 className="heading-3">Film Trending</h3>
      <div className="movie-list">
        <div className="box">
          <BoxMovie movieImg={Movie1} top10={<Top10 />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie2} top10={<Top10 />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie3} top10={<Top10 />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie4} top10={<Top10 />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie5} top10={<Top10 />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie1} top10={<Top10 />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie2} top10={<Top10 />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie3} top10={<Top10 />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie4} top10={<Top10 />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie5} top10={<Top10 />} />
        </div>
      </div>
    </div>
  );
}
