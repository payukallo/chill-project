import { BoxMovie } from "../BoxMovie";
import TheTomorrowWarImg from "../../assets/images/the-tomorrow-war.png";
import QuantumaniaImg from "../../assets/images/quantumania.png";
import GuardiansOfTheGalaxyImg from "../../assets/images/guardians-of-the-galaxy.png";
import AManCalledOttoImg from "../../assets/images/a-man-called-otto.png";
import LittleMermaidImg from "../../assets/images/little-mermaid.png";


export function TheTomorrowWar() {
  return (
  <BoxMovie   
  movieImg={TheTomorrowWarImg}
  isPremium={false}
  isTop10={true}
  isNewEpisode={false}
  title={"The Tomorrow War"}
  rating={""}
  />
  );
}

export function Quantumania() {
  return (
  <BoxMovie   
  movieImg={QuantumaniaImg}
  isPremium={false}
  isTop10={false}
  isNewEpisode={true}
  title={"Quantumania"}
  rating={""}
  />
  );
}

export function GuardiansOfTheGalaxy() {
  return (
  <BoxMovie   
  movieImg={GuardiansOfTheGalaxyImg}
  isPremium={false}
  isTop10={true}
  isNewEpisode={false}
  title={"Guardians Of The Galaxy"}
  rating={""}
  />
  );
}

export function AManCalledOtto() {
  return (
  <BoxMovie   
  movieImg={AManCalledOttoImg}
  isPremium={false}
  isTop10={true}
  isNewEpisode={false}
  title={"A Man Called Otto"}
  rating={""}
  />
  );
}

export function LittleMermaid() {
  return (
  <BoxMovie   
  movieImg={LittleMermaidImg}
  isPremium={false}
  isTop10={false}
  isNewEpisode={false}
  title={"Little Mermaid"}
  rating={""}
  />
  );
}