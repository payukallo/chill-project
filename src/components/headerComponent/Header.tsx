import { useEffect, useState } from "react";
import type { IResponseMovie } from "../type/IResponMovies";
import { DropDownHeader } from "./Genre";
import { HeadBtn } from "./HeadBtn";
import { HeadText } from "./HeadText";

export function Header() {
  const [randomMovie, setRandomMovie] = useState<IResponseMovie | null>(
    null,
  );

  useEffect(() => {
    async function fetchRandomContent() {
      try {
        const [moviesResponse, seriesResponse] = await Promise.all([
          fetch("http://localhost:3000/movies"),
          fetch("http://localhost:3000/series"),
        ]);

        if (!moviesResponse.ok || !seriesResponse.ok) {
          throw new Error("Gagal mengambil data movies atau series");
        }

        const movies: IResponseMovie[] = await moviesResponse.json();
        const series: IResponseMovie[] = await seriesResponse.json();

        // Gabungkan data movies dan series
        const allContent = [...movies, ...series];

        if (allContent.length === 0) return;

        // Pilih satu konten secara acak
        const randomIndex = Math.floor(Math.random() * allContent.length);

        setRandomMovie(allContent[randomIndex]);
      } catch (error) {
        console.error("Gagal mengambil konten:", error);
      }
    }

    fetchRandomContent();
  }, []);

  if (!randomMovie) return null;

  return (
    <header key={randomMovie.id}>
      <img
        src={randomMovie.banner_url}
        alt={randomMovie.title}
      />

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
