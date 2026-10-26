import { AManCalledOtto, GuardiansOfTheGalaxy, LittleMermaid, Quantumania, TheTomorrowWar } from "./MovieList/TrendingList";

export function Trending() {
  return (
    <div className="movies">
      <h3 className="heading-3">Film Trending</h3>
      <div className="movie-list">
        <div className="box">
          <TheTomorrowWar/>
        </div>
         <div className="box">
          <Quantumania/>
        </div>
         <div className="box">
          <GuardiansOfTheGalaxy/>
        </div>
         <div className="box">
          <AManCalledOtto/>
        </div>
         <div className="box">
          <LittleMermaid/>
        </div>
        <div className="box">
          <TheTomorrowWar/>
        </div>
         <div className="box">
          <Quantumania/>
        </div>
         <div className="box">
          <GuardiansOfTheGalaxy/>
        </div>
         <div className="box">
          <AManCalledOtto/>
        </div>
         <div className="box">
          <LittleMermaid/>
        </div>
      </div>
    </div>
  );
}
