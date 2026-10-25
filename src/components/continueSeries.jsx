import Movie1 from "../assets/images/alice-in-borderland-width.png";
import Movie2 from "../assets/images/my-perfect-stranger-width.png";
import Movie3 from "../assets/images/all-of-us-are-dead-width.png";
import Movie4 from "../assets/images/ted-lasso-width.png";
import { BoxMovie } from "./boxMovie";
import { BottomText, NewEpisode } from "./textMovieImage";

export function ContinueSeries() {

  return (
    <div className="continue-movies">
      <h3 className="heading-3">Melanjutkan Tonton Series</h3>
      <div className="movie-top">
        <div className="box-top">
          <BoxMovie movieImg={Movie1} newEpisode={<NewEpisode/>} />
          <BottomText title={"Alice in Borderland"} rating={`\u2605 4.5/5`} />
        </div>
        <div className="box-top">
          <BoxMovie movieImg={Movie2} newEpisode={<NewEpisode/>}/>
          <BottomText title={"My Perfect Stranger"} rating={`\u2605 4.6/5`} />
        </div>
        <div className="box-top">
          <BoxMovie movieImg={Movie3} newEpisode={<NewEpisode />} />
          <BottomText title={"All Of Us Are Dead"} rating={`\u2605 4.2/5`} />
        </div>
        <div className="box-top">
          <BoxMovie movieImg={Movie4} newEpisode={<NewEpisode/>}/>
          <BottomText title={"Ted Lasso"} rating={`\u2605 4.4/5`} />
        </div>
        <div className="box-top">
          <BoxMovie movieImg={Movie1} newEpisode={<NewEpisode/>} />
          <BottomText title={"Alice in Borderland"} rating={`\u2605 4.5/5`} />
        </div>
        <div className="box-top">
          <BoxMovie movieImg={Movie2} newEpisode={<NewEpisode/>}/>
          <BottomText title={"My Perfect Stranger"} rating={`\u2605 4.6/5`} />
        </div>
        <div className="box-top">
          <BoxMovie movieImg={Movie3} newEpisode={<NewEpisode />} />
          <BottomText title={"All Of Us Are Dead"} rating={`\u2605 4.2/5`} />
        </div>
        <div className="box-top">
          <BoxMovie movieImg={Movie4} newEpisode={<NewEpisode/>}/>
          <BottomText title={"Ted Lasso"} rating={`\u2605 4.4/5`} />
        </div>
      </div>
    </div>
  );
}
