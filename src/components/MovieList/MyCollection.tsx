import { BoxMovie } from "../BoxMovie";
import BayMaxImg from "../../assets/images/bay-max.png";
import MyHeroAcademiaImg from "../../assets/images/my-hero-academia.png";
import BlueLockImg from "../../assets/images/blue-lock.png";
import TedLassoImg from "../../assets/images/ted-lasso.png";
import SpiderManImg from "../../assets/images/spider-man.png";
import MeganImg from "../../assets/images/megan.png";
import DilanImg from "../../assets/images/dilan-1991.png";

export function BayMax() {
  return (
  <BoxMovie   
  movieImg={BayMaxImg}
  isPremium={false}
  isTop10={false}
  isNewEpisode={false}
  title={"Bay Max"}
  rating={""}
  />
  );
}

export function MyHeroAcademia() {
  return (
  <BoxMovie   
  movieImg={MyHeroAcademiaImg}
  isPremium={false}
  isTop10={false}
  isNewEpisode={true}
  title={"My Hero Academia"}
  rating={""}
  />
  );
}

export function BlueLock() {
  return (
  <BoxMovie   
  movieImg={BlueLockImg}
  isPremium={false}
  isTop10={false}
  isNewEpisode={true}
  title={"Blue Lock"}
  rating={""}
  />
  );
}

export function TedLasso() {
  return (
  <BoxMovie   
  movieImg={TedLassoImg}
  isPremium={false}
  isTop10={true}
  isNewEpisode={true}
  title={"Ted Lasso"}
  rating={""}
  />
  );
}

export function SpiderMan() {
  return (
  <BoxMovie   
  movieImg={SpiderManImg}
  isPremium={false}
  isTop10={false}
  isNewEpisode={false}
  title={"Spider Man"}
  rating={""}
  />
  );
}

export function Megan() {
  return (
  <BoxMovie   
  movieImg={MeganImg}
  isPremium={false}
  isTop10={false}
  isNewEpisode={false}
  title={"Megan"}
  rating={""}
  />
  );
}

export function Dilan() {
  return (
  <BoxMovie   
  movieImg={DilanImg}
  isPremium={false}
  isTop10={false}
  isNewEpisode={false}
  title={"Dilan 1991"}
  rating={""}
  />
  );
}