import "../assets/styles/index.css";
import { Navbar } from "../layouts/Navbar";
import { Header } from "../components/Header";
import { Footer } from "../layouts/Footer";
import { useEffect, useState } from "react";
import { getMovies } from "../components/type/MovieApi";
import type { IResponseMovie } from "../components/type/IResponMovies";
import { NewRelease } from "../components/NewRelease";
import { ContinueMovie } from "../components/Continue";
import { TrendingMovies } from "../components/Trending";
import { TopRatingMovies } from "../components/TopRating";
import { PopUpMovieTop } from "../components/PopUpMovieTop";
import { PopUpMovieBottom } from "../components/PopUpMovieBottom";

export default function HomePage() {
  const [movieHeader, setMovieHeader] = useState<IResponseMovie[]>([]);
  const [movieNewRelease, setMovieNewRelease] = useState<IResponseMovie[]>([]);
  const [movieTopRating, setMovieTopRating] = useState<IResponseMovie[]>([]);
  const [movieTrending, setMovieTrending] = useState<IResponseMovie[]>([]);
  const [movieContinue, setMovieContinue] = useState<IResponseMovie[]>([]);
  const [allMovies, setAllMovies] = useState<IResponseMovie[]>([]);

  const [selectedMovieTop, setSelectedMovieTop] =
    useState<IResponseMovie | null>(null);
  const [selectedMovieBottom, setSelectedMovieBottom] =
    useState<IResponseMovie | null>(null);

  const handleOpenPopupTop = (movie: IResponseMovie) => {
  setSelectedMovieBottom(null);
  setSelectedMovieTop(movie);
};

const handleOpenPopupBottom = (movie: IResponseMovie) => {
  setSelectedMovieTop(null);
  setSelectedMovieBottom(movie);
};

const handleClosePopupTop = () => {
  setSelectedMovieTop(null);
};

const handleClosePopupBottom = () => {
  setSelectedMovieBottom(null);
};

  useEffect(() => {
    const getData = async () => {
      try {
        const movies = await getMovies();
        const shuffledMovies = [...movies].sort(() => Math.random() - 0.5);
        const continue_movie = shuffledMovies.slice(0, 10);
        const header_movie = shuffledMovies.slice(0, 1);
        const top_rating = movies.filter(
          (movie) => movie.top_rating_today === true,
        );
        setAllMovies(movies);
        const trending = movies.filter((movie) => movie.is_top_10 === true);
        const new_release = [...movies]
          .sort((a, b) => b.year - a.year)
          .slice(0, 10);

        setMovieHeader(header_movie);
        setMovieContinue(continue_movie);
        setMovieTopRating(top_rating);
        setMovieTrending(trending);
        setMovieNewRelease(new_release);
      } catch (error) {
        console.error("Error => ", error);
      }
    };

    getData();
  }, []);

  return (
    <main className="home-page box-pop-up-content">
      <Navbar />
      <Header movies={movieHeader} on_click={handleOpenPopupTop} />
      <div className="content">
        <ContinueMovie
          movies={movieContinue}
          on_click={handleOpenPopupTop}
          headTitle="Melanjutkan Tonton Film"
        />
        <TopRatingMovies
          movies={movieTopRating}
          on_click={handleOpenPopupTop}
          headTitle="Top Rating Film dan Series Hari ini"
        />
        <TrendingMovies
          movies={movieTrending}
          headTitle="Film Trending"
          on_click={handleOpenPopupBottom}
        />
        <NewRelease
          movies={movieNewRelease}
          headTitle="Rilis Baru"
          on_click={handleOpenPopupBottom}
        />
      </div>
      <Footer />
      {selectedMovieTop && (
        <PopUpMovieTop
          movie={selectedMovieTop}
          onClose={handleClosePopupTop}
          movies={allMovies}
          onMovieClick={handleOpenPopupTop}
        />
      )}
      {selectedMovieBottom && (
        <PopUpMovieBottom
          movie={selectedMovieBottom}
          onClose={handleClosePopupBottom}
            movies={allMovies}
          onMovieClick={handleOpenPopupBottom}
        />
      )}
    </main>
  );
}
