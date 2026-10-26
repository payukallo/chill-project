import { AllOfUsAreDead, BigHero6, JurassicWorld, Sonic2, Suzume } from "./MovieList/TopRatingList";

export function TopRating() {
  return (
    <div className="movies">
      <h3 className="heading-3">Top Rating Film dan Series Hari Ini</h3>
      <div className="movie-list">
        <div className="box">
          <Suzume />
        </div>
        <div className="box">
          <JurassicWorld />
        </div>
        <div className="box">
          <Sonic2 />
        </div>
        <div className="box">
          <AllOfUsAreDead />
        </div>
        <div className="box">
          <BigHero6 />
        </div>
        <div className="box">
          <Suzume />
        </div>
        <div className="box">
          <JurassicWorld />
        </div>
        <div className="box">
          <Sonic2 />
        </div>
        <div className="box">
          <AllOfUsAreDead />
        </div>
        <div className="box">
          <BigHero6 />
        </div>
      </div>
    </div>
  );
}
