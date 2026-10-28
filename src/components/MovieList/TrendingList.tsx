import { BoxMovie } from "../BoxMovie";
import TheTomorrowWarImg from "../../assets/images/the-tomorrow-war.png";
import QuantumaniaImg from "../../assets/images/quantumania.png";
import GuardiansOfTheGalaxyImg from "../../assets/images/guardians-of-the-galaxy.png";
import AManCalledOttoImg from "../../assets/images/a-man-called-otto.png";
import LittleMermaidImg from "../../assets/images/little-mermaid.png";
import { BayMax, BlueLock, MyHeroAcademia } from "./MyCollection";

export function TheTomorrowWar() {
  return (
    <BoxMovie
      movieImg={TheTomorrowWarImg}
      isPremium={false}
      isTop10={true}
      isNewEpisode={false}
      title={"The Tomorrow War"}
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

export function Quantumania() {
  return (
    <BoxMovie
      movieImg={QuantumaniaImg}
      isPremium={false}
      isTop10={false}
      isNewEpisode={true}
      title={"Quantumania"}
      rating={""}
      year={"2025"}
      duration={"2j 29m"}
      movieDescription={
        "Masih goyah karena kehilangan Gamora, Peter Quill mengumpulkan timnya untuk mempertahankan alam semesta dan salah satu dari mereka - sebuah misi yang bisa berarti akhir dari Penjaga jika tidak berhasil."
      }
      ageRecommendation={"12+"}
      recommendationMovie1={<BayMax />}
      recommendationMovie2={<MyHeroAcademia />}
      recommendationMovie3={<BlueLock />}
      cast={"Chris Pratt, Chukwudi Iwuji, Bradley Cooper, dan lain lain"}
      genre={"Aksi, Petualangan, Komedi"}
      filmMaker={"James Gunn"}
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
      year={"2025"}
      duration={"2j 29m"}
      movieDescription={
        "Masih goyah karena kehilangan Gamora, Peter Quill mengumpulkan timnya untuk mempertahankan alam semesta dan salah satu dari mereka - sebuah misi yang bisa berarti akhir dari Penjaga jika tidak berhasil."
      }
      ageRecommendation={"16+"}
      recommendationMovie1={<BayMax />}
      recommendationMovie2={<MyHeroAcademia />}
      recommendationMovie3={<BlueLock />}
      cast={"Chris Pratt, Chukwudi Iwuji, Bradley Cooper, dan lain lain"}
      genre={"Aksi, Petualangan, Komedi"}
      filmMaker={"James Gunn"}
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
      year={"2025"}
      duration={"2j 29m"}
      movieDescription={
        "Masih goyah karena kehilangan Gamora, Peter Quill mengumpulkan timnya untuk mempertahankan alam semesta dan salah satu dari mereka - sebuah misi yang bisa berarti akhir dari Penjaga jika tidak berhasil."
      }
      ageRecommendation={"15+"}
      recommendationMovie1={<BayMax />}
      recommendationMovie2={<MyHeroAcademia />}
      recommendationMovie3={<BlueLock />}
      cast={"Chris Pratt, Chukwudi Iwuji, Bradley Cooper, dan lain lain"}
      genre={"Aksi, Petualangan, Komedi"}
      filmMaker={"James Gunn"}
    />
  );
}

export function LittleMermaid() {
  return (
    <BoxMovie
      movieImg={LittleMermaidImg}
      isPremium={true}
      isTop10={false}
      isNewEpisode={false}
      title={"Little Mermaid"}
      rating={""}
      year={"2025"}
      duration={"2j 29m"}
      movieDescription={
        "Masih goyah karena kehilangan Gamora, Peter Quill mengumpulkan timnya untuk mempertahankan alam semesta dan salah satu dari mereka - sebuah misi yang bisa berarti akhir dari Penjaga jika tidak berhasil."
      }
      ageRecommendation={"13+"}
      recommendationMovie1={<BayMax />}
      recommendationMovie2={<MyHeroAcademia />}
      recommendationMovie3={<BlueLock />}
      cast={"Chris Pratt, Chukwudi Iwuji, Bradley Cooper, dan lain lain"}
      genre={"Aksi, Petualangan, Komedi"}
      filmMaker={"James Gunn"}
    />
  );
}
