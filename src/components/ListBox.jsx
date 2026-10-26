import { AllOfUsAreDead, Sonic2, Suzume } from "./MovieList/TopRatingList";
import { BayMax, BlueLock, Dilan, Megan, MyHeroAcademia, SpiderMan, TedLasso } from "./MovieList/MyCollection";
import { DutyAfterSchool } from "./MovieList/NewReleaseList";
import { GuardiansOfTheGalaxy } from "./MovieList/TrendingList";

export function ListBox() {
  return (
    <div className="list-container">
      <div className="list-box">
        <AllOfUsAreDead/>
      </div>
      <div className="list-box">
        <BayMax/>
      </div>
      <div className="list-box">
        <MyHeroAcademia/>
      </div>
      <div className="list-box">
        <BlueLock/>
      </div>
      <div className="list-box">
        <TedLasso/>
      </div>
      <div className="list-box">
        <DutyAfterSchool/>
      </div>
      <div className="list-box">
        <Suzume/>
      </div>
      <div className="list-box">
        <GuardiansOfTheGalaxy/>
      </div>
      <div className="list-box">
        <SpiderMan/>
      </div>
      <div className="list-box">
        <Sonic2/>
      </div>
      <div className="list-box">
        <Megan/>
      </div>
      <div className="list-box">
        <Dilan/>
      </div>
      
    </div>
  );
}
