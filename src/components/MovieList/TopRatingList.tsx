import { BoxMovie } from "../BoxMovie";
import SuzumeImg from "../../assets/images/suzume.png";
import JurassicWorldImg from "../../assets/images/jurassic-world.png";
import Sonic2Img from "../../assets/images/sonic-2.png";
import AllOfUsAreDeadImg from "../../assets/images/all-of-us-are-dead.png";
import BigHero6Img from "../../assets/images/big-hero-6.png";
import { BayMax, BlueLock, MyHeroAcademia } from "./MyCollection";

export function Suzume() {
  return (
    <BoxMovie
      movieImg={SuzumeImg}
      isPremium={false}
      isTop10={false}
      isNewEpisode={true}
      title={"Don't Look Up"}
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

export function JurassicWorld() {
  return (
    <BoxMovie
      movieImg={JurassicWorldImg}
      isPremium={false}
      isTop10={false}
      isNewEpisode={false}
      title={"Jurassic World"}
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

export function Sonic2() {
  return (
    <BoxMovie
      movieImg={Sonic2Img}
      isPremium={false}
      isTop10={false}
      isNewEpisode={false}
      title={"Sonic 2"}
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

export function AllOfUsAreDead() {
  return (
    <BoxMovie
      movieImg={AllOfUsAreDeadImg}
      isPremium={true}
      isTop10={false}
      isNewEpisode={true}
      title={"All Of Us Are Dead"}
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

export function BigHero6() {
  return (
    <BoxMovie
      movieImg={BigHero6Img}
      isPremium={true}
      isTop10={true}
      isNewEpisode={false}
      title={"Big Hero 6"}
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
