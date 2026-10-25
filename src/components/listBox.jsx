import { BoxMovie } from "./boxMovie";
import Movie1 from "../assets/images/all-of-us-are-dead.png";
import Movie2 from "../assets/images/bay-max.png";
import Movie3 from "../assets/images/my-hero-academia.png";
import Movie4 from "../assets/images/blue-lock.png";
import Movie5 from "../assets/images/ted-lasso.png";
import Movie6 from "../assets/images/duty-after-school.png";
import Movie7 from "../assets/images/suzume.png";
import Movie8 from "../assets/images/guardians-of-the-galaxy.png";
import Movie9 from "../assets/images/spider-man.png";
import Movie10 from "../assets/images/sonic-2.png";
import Movie11 from "../assets/images/megan.png";
import Movie12 from "../assets/images/dilan-1991.png";
import { NewEpisode, Top10 } from "./textMovieImage";

export function ListBox() {
  return (
    <div className="list-container">
      <div className="list-box">
        <BoxMovie movieImg={Movie1} newEpisode={<NewEpisode/>} />
      </div>
      <div className="list-box">
        <BoxMovie movieImg={Movie2} />
      </div>
      <div className="list-box">
        <BoxMovie movieImg={Movie3} newEpisode={<NewEpisode/>} />
      </div>
      <div className="list-box">
        <BoxMovie movieImg={Movie4} newEpisode={<NewEpisode/>} />
      </div>
      <div className="list-box">
        <BoxMovie movieImg={Movie5} newEpisode={<NewEpisode/>} />
      </div>
      <div className="list-box">
        <BoxMovie movieImg={Movie6} newEpisode={<NewEpisode/>} top10={<Top10/>} />
      </div>
      <div className="list-box">
        <BoxMovie movieImg={Movie7} top10={<Top10/>} />
      </div>
       <div className="list-box">
        <BoxMovie movieImg={Movie8} top10={<Top10/>} />
      </div>
       <div className="list-box">
        <BoxMovie movieImg={Movie9} />
      </div>
       <div className="list-box">
        <BoxMovie movieImg={Movie10} />
      </div>
       <div className="list-box">
        <BoxMovie movieImg={Movie11} />
      </div>
       <div className="list-box">
        <BoxMovie movieImg={Movie12} />
      </div>
    </div>
  );
}
