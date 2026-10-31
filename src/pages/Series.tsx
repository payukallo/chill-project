import "../assets/styles/index.css";
import { Navbar } from "../layouts/Navbar";
import { Header } from "../components/Header";
import { Footer } from "../layouts/Footer";
import { useEffect, useState } from "react";
import { getSeries } from "../components/type/MovieApi";
import type { IResponseMovie } from "../components/type/IResponMovies";
import { NewRelease } from "../components/NewRelease";
import { ContinueMovie } from "../components/Continue";
import { TrendingMovies } from "../components/Trending";
import { TopRatingMovies } from "../components/TopRating";
import { MoviesFromChill } from "../components/FromChill ";
import { PopUpSeriesBottom } from "../components/PopUpSeriesBottom";
import { PopUpSeriesTop } from "../components/PopUpSeriesTop";

export default function SeriesPage() {
  const [movieHeader, setMovieHeader] = useState<IResponseMovie[]>([]);
  const [movieContinue, setMovieContinue] = useState<IResponseMovie[]>([]);
  const [movieFromChill, setMovieFromChill] = useState<IResponseMovie[]>([]);
  const [movieTopRating, setMovieTopRating] = useState<IResponseMovie[]>([]);
  const [movieTrending, setMovieTrending] = useState<IResponseMovie[]>([]);
  const [movieNewRelease, setMovieNewRelease] = useState<IResponseMovie[]>([]);

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
        const movies = await getSeries();
        const shuffledMovies = [...movies].sort(() => Math.random() - 0.5);
        const continue_movie = shuffledMovies.slice(0, 10);
        const header_movie = shuffledMovies.slice(0, 1);
        const from_chill = movies.filter((movie) => movie.is_premium === true);
        const top_rating = movies.filter(
          (movie) => movie.top_rating_today === true,
        );
        const trending = movies.filter((movie) => movie.is_top_10 === true);
        const new_release = [...movies]
          .sort((a, b) => b.year - a.year)
          .slice(0, 10);

        setMovieHeader(header_movie);
        setMovieContinue(continue_movie);
        setMovieFromChill(from_chill);
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
          headTitle="Melanjutkan Tonton Series"
        />
        <MoviesFromChill
          movies={movieFromChill}
          on_click={handleOpenPopupTop}
          headTitle="Series Persembahan Chill"
        />
        <TopRatingMovies
          movies={movieTopRating}
          on_click={handleOpenPopupBottom}
          headTitle="Top Rating Series Hari ini"
        />
        <TrendingMovies
          movies={movieTrending}
          headTitle="Series Trending"
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
        <PopUpSeriesTop
          movie={selectedMovieTop}
          onClose={handleClosePopupTop}
        />
      )}
      {selectedMovieBottom && (
        <PopUpSeriesBottom
          movie={selectedMovieBottom}
          onClose={handleClosePopupBottom}
        />
      )}
    </main>
  );
}
