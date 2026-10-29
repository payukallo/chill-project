import { DropDownHeader } from "./Genre";
import { HeadBtn } from "./HeadBtn";
import { HeadText } from "./HeadText";
import { useEffect, useState } from "react";
import type { IResponseMovie } from "../type/IResponMovies";

export function HeaderSeries() {
  const [randomMovie, setRandomMovie] = useState<IResponseMovie | null>(null);

  useEffect(() => {
    async function fetchRandomMovie() {
      try {
        const response = await fetch("http://localhost:3000/series");

        if (!response.ok) {
          throw new Error("Gagal mengambil data film");
        }

        const movies: IResponseMovie[] = await response.json();

        if (movies.length === 0) return;

        const randomIndex = Math.floor(Math.random() * movies.length);

        setRandomMovie(movies[randomIndex]);
      } catch (error) {
        console.error("Gagal mengambil film:", error);
      }
    }

    fetchRandomMovie();
  }, []);

  if (!randomMovie) return null;

  return (
    <header key={randomMovie.id}>
      <img src={randomMovie.banner_url} alt={randomMovie.title} />
      <div className="header">
        <DropDownHeader />
        <div className="head-bottom">
          <HeadText
            title={randomMovie.title ?? ""}
            description={randomMovie.description ?? ""}
          />
          <HeadBtn />
        </div>
      </div>
    </header>
  );
}