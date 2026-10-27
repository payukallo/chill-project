import { BoxMovie } from "../BoxMovie";
import SuzumeImg from "../../assets/images/suzume.png";
import JurassicWorldImg from "../../assets/images/jurassic-world.png";
import Sonic2Img from "../../assets/images/sonic-2.png";
import AllOfUsAreDeadImg from "../../assets/images/all-of-us-are-dead.png";
import BigHero6Img from "../../assets/images/big-hero-6.png";


export function Suzume() {
  return (
  <BoxMovie   
  movieImg={SuzumeImg}
  isPremium={false}
  isTop10={false}
  isNewEpisode={true}
  title={"Don't Look Up"}
  rating={""}
  />
  );
}

export function JurassicWorld() {
  return (
  <BoxMovie   
  movieImg={JurassicWorldImg}
  isPremium={false}
  isTop10={false}
  isNewEpisode={false}
  title={"Jurassic World"}
  rating={""}
  />
  );
}

export function Sonic2() {
  return (
  <BoxMovie   
  movieImg={Sonic2Img}
  isPremium={false}
  isTop10={false}
  isNewEpisode={false}
  title={"Sonic 2"}
  rating={""}
  />
  );
}

export function AllOfUsAreDead() {
  return (
  <BoxMovie   
  movieImg={AllOfUsAreDeadImg}
  isPremium={true}
  isTop10={false}
  isNewEpisode={true}
  title={"All Of Us Are Dead"}
  rating={""}
  />
  );
}

export function BigHero6() {
  return (
  <BoxMovie   
  movieImg={BigHero6Img}
  isPremium={true}
  isTop10={true}
  isNewEpisode={false}
  title={"Big Hero 6"}
  rating={""}
  />
  );

}
