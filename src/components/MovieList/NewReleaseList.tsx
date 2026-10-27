import { BoxMovie } from "../BoxMovie";
import DutyAfterSchoolImg from "../../assets/images/duty-after-school.png";
import MissingImg from "../../assets/images/missing.png";
import { BayMax, BlueLock, MyHeroAcademia } from "./MyCollection";

export function DutyAfterSchool() {
  return (
    <BoxMovie
      movieImg={DutyAfterSchoolImg}
      isPremium={true}
      isTop10={false}
      isNewEpisode={true}
      title={"Duty After School"}
      rating={""}
      year={"2025"}
      duration={"2j 29m"}
      movieDescription={
        "Masih goyah karena kehilangan Gamora, Peter Quill mengumpulkan timnya untuk mempertahankan alam semesta dan salah satu dari mereka - sebuah misi yang bisa berarti akhir dari Penjaga jika tidak berhasil."
      }
      ageRecommendation={"PG-13"}
      recommendationMovie1={<BayMax />}
      recommendationMovie2={<MyHeroAcademia />}
      recommendationMovie3={<BlueLock />}
      cast={"Chris Pratt, Chukwudi Iwuji, Bradley Cooper, dan lain lain"}
      genre={"Aksi, Petualangan, Komedi"}
      filmMaker={"James Gunn"}
    />
  );
}

export function Missing() {
  return (
    <BoxMovie
      movieImg={MissingImg}
      isPremium={true}
      isTop10={false}
      isNewEpisode={false}
      title={"Missing"}
      rating={""}
      year={"2025"}
      duration={"2j 29m"}
      movieDescription={
        "Masih goyah karena kehilangan Gamora, Peter Quill mengumpulkan timnya untuk mempertahankan alam semesta dan salah satu dari mereka - sebuah misi yang bisa berarti akhir dari Penjaga jika tidak berhasil."
      }
      ageRecommendation={"PG-13"}
      recommendationMovie1={<BayMax />}
      recommendationMovie2={<MyHeroAcademia />}
      recommendationMovie3={<BlueLock />}
      cast={"Chris Pratt, Chukwudi Iwuji, Bradley Cooper, dan lain lain"}
      genre={"Aksi, Petualangan, Komedi"}
      filmMaker={"James Gunn"}
    />
  );
}
