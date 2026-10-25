import Movie1 from "../assets/images/suzume.png";
import Movie2 from "../assets/images/jurassic-world.png";
import Movie3 from "../assets/images/sonic-2.png";
import Movie4 from "../assets/images/all-of-us-are-dead.png";
import Movie5 from "../assets/images/big-hero-5.png";
import { BoxMovie } from "./boxMovie";
import { NewEpisode, Top10 } from "./textMovieImage";

export function TopRating() {
  return (
    <div className="movies">
      <h3 className="heading-3">Top Rating Film dan Series Hari Ini</h3>
      <div className="movie-list">
        <div className="box">
          <BoxMovie movieImg={Movie1} newEpisode={<NewEpisode />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie2} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie3} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie4} newEpisode={<NewEpisode />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie5} top10={<Top10 />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie1} newEpisode={<NewEpisode />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie2} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie3} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie4} newEpisode={<NewEpisode />} />
        </div>
        <div className="box">
          <BoxMovie movieImg={Movie5} top10={<Top10 />} />
        </div>
      </div>
    </div>
  );
}
