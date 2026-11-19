import "../assets/styles/index.css";
import { useEffect, useState } from "react";
import { Navbar } from "../layouts/Navbar";
import { Header } from "../components/Header";
import { Footer } from "../layouts/Footer";
import { getMovies } from "../components/type/MovieApi";
import type { IResponseMovie } from "../components/type/IResponMovies";
import { NewRelease } from "../components/NewRelease";
import { ContinueMovie } from "../components/Continue";
import { TrendingMovies } from "../components/Trending";
import { TopRatingMovies } from "../components/TopRating";
import { MoviesFromChill } from "../components/FromChill ";
import { PopUpMovieTop } from "../components/PopUpMovieTop";
import { PopUpMovieBottom } from "../components/PopUpMovieBottom";
import { useContinueWatching } from "../components/hooks/UseContinueWatching";

export default function MoviesPage() {
  // ========================================
  // DATA KATALOG FILM
  // ========================================

  const [movieHeader, setMovieHeader] = useState<IResponseMovie[]>([]);
  const [movieFromChill, setMovieFromChill] = useState<IResponseMovie[]>([]);
  const [movieTopRating, setMovieTopRating] = useState<IResponseMovie[]>([]);
  const [movieTrending, setMovieTrending] = useState<IResponseMovie[]>([]);
  const [movieNewRelease, setMovieNewRelease] = useState<IResponseMovie[]>([]);
  const [allMovies, setAllMovies] = useState<IResponseMovie[]>([]);

  // ========================================
  // POPUP
  // ========================================

  const [selectedMovieTop, setSelectedMovieTop] =
    useState<IResponseMovie | null>(null);

  const [selectedMovieBottom, setSelectedMovieBottom] =
    useState<IResponseMovie | null>(null);

  // ========================================
  // CONTINUE WATCHING KHUSUS FILM
  // ========================================

  const { continueMovies, loading: continueLoading } = useContinueWatching({
    movies: allMovies,
    series: [],
  });

  // ========================================
  // EVENT POPUP
  // ========================================

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

  // ========================================
  // MENGAMBIL DATA KATALOG FILM
  // ========================================

  useEffect(() => {
    let active = true;

    const getData = async () => {
      try {
        const movies = await getMovies();

        if (!active) return;

        const shuffledMovies = [...movies].sort(() => Math.random() - 0.5);
        const headerMovie = shuffledMovies.slice(0, 1);
        const fromChill = movies.filter((movie) => movie.is_premium === true);
        const topRating = movies.filter(
          (movie) => movie.top_rating_today === true,
        );

        const trending = movies.filter((movie) => movie.is_top_10 === true);
        const newRelease = [...movies]
          .sort((a, b) => b.year - a.year)
          .slice(0, 10);

        // Katalog lengkap untuk pencocokan Watch History
        setAllMovies(movies);

        // Konten halaman Movies lainnya
        setMovieHeader(headerMovie);
        setMovieFromChill(fromChill);
        setMovieTopRating(topRating);
        setMovieTrending(trending);
        setMovieNewRelease(newRelease);
      } catch (error) {
        console.error("Gagal mengambil katalog Movies:", error);
      }
    };

    getData();

    return () => {
      active = false;
    };
  }, []);

  // ========================================
  // TAMPILAN MOVIES
  // ========================================

  return (
    <main className="home-page box-pop-up-content">
      <Navbar />

      <Header movies={movieHeader} on_click={handleOpenPopupTop} />

      <div className="content">

        {!continueLoading && continueMovies.length > 0 && (
          <ContinueMovie
            movies={continueMovies}
            on_click={handleOpenPopupTop}
            headTitle="Melanjutkan Tonton Film"
          />
        )}

        <MoviesFromChill
          movies={movieFromChill}
          on_click={handleOpenPopupTop}
          headTitle="Film Persembahan Chill"
        />

        <TopRatingMovies
          movies={movieTopRating}
          on_click={handleOpenPopupBottom}
          headTitle="Top Rating Film Hari ini"
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

      {/* Popup Film Top */}
      {selectedMovieTop && (
        <PopUpMovieTop
          movie={selectedMovieTop}
          onClose={handleClosePopupTop}
          movies={allMovies}
          onMovieClick={handleOpenPopupTop}
        />
      )}

      {/* Popup Film Bottom */}
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
