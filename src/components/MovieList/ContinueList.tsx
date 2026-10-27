import { BoxMovie } from "../BoxMovie";
import DontLookUpImg from "../../assets/images/don't-look-up-width.png";
import AllOfUsAreDeadImgWidth from "../../assets/images/all-of-us-are-dead-width.png";
import BlueLockImgWidth from "../../assets/images/blue-lock-width.png";
import AManCalledOttoImgWidth from "../../assets/images/a-man-called-otto-width.png";
import AliceInBorderlandImgWidth from "../../assets/images/alice-in-borderland-width.png";
import MyPerfectStrangerImgWidth from "../../assets/images/my-perfect-stranger-width.png";
import TedLassoImgWidth from "../../assets/images/ted-lasso-width.png";


export function DontLookUpContinue() {
  return (
  <BoxMovie   
  movieImg={DontLookUpImg}
  isPremium={false}
  isTop10={false}
  isNewEpisode={false}
  title={"Don't Look Up"}
  rating={"\u2605 4.5/5"}
  />
  );
}

export function AllOfUsAreDeadContinue() {
  return (
  <BoxMovie   
  movieImg={AllOfUsAreDeadImgWidth}
  isPremium={false}
  isTop10={false}
  isNewEpisode={true}
  title={"All of Us Are Dead"}
  rating={"\u2605 4.2/5"}
  />
  );
}

export function BlueLockContinue() {
  return (
  <BoxMovie   
  movieImg={BlueLockImgWidth}
  isPremium={false}
  isTop10={false}
  isNewEpisode={true}
  title={"Blue Lock"}
  rating={"\u2605 4.6/5"}
  />
  );
}

export function AManCalledOttoContinue() {
  return (
  <BoxMovie   
  movieImg={AManCalledOttoImgWidth}
  isPremium={false}
  isTop10={false}
  isNewEpisode={false}
  title={"A Man Called Otto"}
  rating={"\u2605 4.4/5"}
  />
  );
}

export function AliceInBorderlandContinue() {
  return (
  <BoxMovie   
  movieImg={AliceInBorderlandImgWidth}
  isPremium={false}
  isTop10={false}
  isNewEpisode={true}
  title={"Alice In Borderland"}
  rating={"\u2605 4.5/5"}
  />
  );
}

export function MyPerfectStrangerContinue() {
  return (
  <BoxMovie   
  movieImg={MyPerfectStrangerImgWidth}
  isPremium={false}
  isTop10={false}
  isNewEpisode={true}
  title={"My Perfect Stranger"}
  rating={"\u2605 4.6/5"}
  />
  );
}

export function TedLassoContinue() {
  return (
  <BoxMovie   
  movieImg={TedLassoImgWidth}
  isPremium={false}
  isTop10={false}
  isNewEpisode={true}
  title={"Ted Lasso"}
  rating={"\u2605 4.4/5"}
  />
  );
}

