import { LittleMermaid } from "./MovieList/TrendingList";
import { DutyAfterSchool, Missing } from "./MovieList/NewReleaseList";
import { AllOfUsAreDead, BigHero6 } from "./MovieList/TopRatingList";

export function MoviesFromChill() {
  return (
    <div className="movies">
      <h3 className="heading-3">Film Persembahan Chill</h3>
      <div className="movie-list">
        <div className="box">
          <LittleMermaid />
        </div>
        <div className="box">
          <DutyAfterSchool />
        </div>
        <div className="box">
          <BigHero6 />
        </div>
        <div className="box">
          <AllOfUsAreDead />
        </div>
        <div className="box">
          <Missing />
        </div>
         <div className="box">
          <LittleMermaid />
        </div>
        <div className="box">
          <DutyAfterSchool />
        </div>
        <div className="box">
          <BigHero6 />
        </div>
        <div className="box">
          <AllOfUsAreDead />
        </div>
        <div className="box">
          <Missing />
        </div>
      </div>
    </div>
  );
}
