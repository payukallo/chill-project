import "../assets/styles/index.css";
import { useEffect, useState } from "react";
import { Navbar } from "../layouts/Navbar";
import { Header } from "../components/Header";
import { Footer } from "../layouts/Footer";
import { getMovies } from "../components/type/MovieApi";
import type { IResponseMovie } from "../components/type/IResponMovies";
import { ContinueMovie } from "../components/Continue";
import { MoviesContainer } from "../components/MoviesContainer";
import { useContinueWatching } from "../components/hooks/UseContinueWatching";
import { MoviePopupContent } from "../components/MoviePopupContent";

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
  const [movieFree, setMovieFree] = useState<IResponseMovie[]>([]);

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

        const free = movies.filter((movie) => movie.is_premium === false);

        // Katalog lengkap untuk pencocokan Watch History
        setAllMovies(movies);

        // Konten halaman Movies lainnya
        setMovieHeader(headerMovie);
        setMovieFromChill(fromChill);
        setMovieTopRating(topRating);
        setMovieTrending(trending);
        setMovieNewRelease(newRelease);
        setMovieFree(free);
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

        <MoviesContainer
          movies={movieFromChill}
          on_click={handleOpenPopupTop}
          headTitle="Film Persembahan Chill"
        />

        <MoviesContainer
          movies={movieTopRating}
          on_click={handleOpenPopupBottom}
          headTitle="Top Rating Film Hari ini"
        />

        <MoviesContainer
          movies={movieTrending}
          headTitle="Film Trending"
          on_click={handleOpenPopupBottom}
        />

        <MoviesContainer
          movies={movieNewRelease}
          headTitle="Rilis Baru"
          on_click={handleOpenPopupBottom}
        />

        <MoviesContainer
          movies={movieFree}
          headTitle="Film Gratis"
          on_click={handleOpenPopupBottom}
        />
      </div>

      <Footer />

      {/* Popup Film Top */}
      {selectedMovieTop && (
        <MoviePopupContent
          movie={selectedMovieTop}
          onClose={handleClosePopupTop}
          movies={allMovies}
          onMovieClick={handleOpenPopupTop}
          variant="top"
        />
      )}

      {/* Popup Film Bottom */}
      {selectedMovieBottom && (
        <MoviePopupContent
          movie={selectedMovieBottom}
          onClose={handleClosePopupBottom}
          movies={allMovies}
          onMovieClick={handleOpenPopupBottom}
          variant="bottom"
        />
      )}
    </main>
  );
}
