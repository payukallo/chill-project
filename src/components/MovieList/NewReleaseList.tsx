import { BoxMovie } from "../BoxMovie";
import DutyAfterSchoolImg from "../../assets/images/duty-after-school.png";
import MissingImg from "../../assets/images/missing.png";

export function DutyAfterSchool() {
  return (
  <BoxMovie   
  movieImg={DutyAfterSchoolImg}
  isPremium={false}
  isTop10={false}
  isNewEpisode={true}
  title={"Duty After School"}
  rating={""}
  />
  );
}

export function Missing() {
  return (
  <BoxMovie   
  movieImg={MissingImg}
  isPremium={false}
  isTop10={false}
  isNewEpisode={false}
  title={"Missing"}
  rating={""}
  />
  );
}