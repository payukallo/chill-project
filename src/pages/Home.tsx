import "../assets/styles/index.css";
import { useEffect, useState } from "react";
import { Navbar } from "../layouts/Navbar";
import { Footer } from "../layouts/Footer";
import { Header } from "../components/Header";
import { ContinueMovie } from "../components/Continue";
import { TrendingMovies } from "../components/Trending";
import { TopRatingMovies } from "../components/TopRating";
import { NewRelease } from "../components/NewRelease";
import { PopUpMovieTop } from "../components/PopUpMovieTop";
import { PopUpMovieBottom } from "../components/PopUpMovieBottom";
import { PopUpSeriesTop } from "../components/PopUpSeriesTop";
import { getMovies, getSeries } from "../components/type/MovieApi";
import type {
  IEpisode,
  IResponseMovie,
} from "../components/type/IResponMovies";
import { useContinueWatching } from "../components/hooks/UseContinueWatching";

export default function HomePage() {
  // ========================================
  // DATA KATALOG
  // ========================================

  const [headerMedia, setMovieHeader] = useState<IResponseMovie[]>([]);
  const [movieNewRelease, setMovieNewRelease] = useState<IResponseMovie[]>([]);
  const [movieTopRating, setMovieTopRating] = useState<IResponseMovie[]>([]);
  const [movieTrending, setMovieTrending] = useState<IResponseMovie[]>([]);
  const [allMovies, setAllMovies] = useState<IResponseMovie[]>([]);
  const [allSeries, setAllSeries] = useState<IResponseMovie[]>([]);

  // ========================================
  // POPUP
  // ========================================

  const [selectedMovieTop, setSelectedMovieTop] =
    useState<IResponseMovie | null>(null);

  const [selectedMovieBottom, setSelectedMovieBottom] =
    useState<IResponseMovie | null>(null);

  const [selectedSeriesTop, setSelectedSeriesTop] =
    useState<IResponseMovie | null>(null);

  // ========================================
  // CONTINUE WATCHING
  // ========================================

  const [fromContinueWatching, setFromContinueWatching] = useState(false);
  const { continueAll, loading: continueLoading } = useContinueWatching({
    movies: allMovies,
    series: allSeries,
  });

  // ========================================
  // MEMBUKA POPUP CONTINUE WATCHING
  // ========================================

  const handleOpenContinueWatching = (media: IResponseMovie) => {
    // Tutup popup sebelumnya
    setSelectedMovieTop(null);
    setSelectedMovieBottom(null);
    setSelectedSeriesTop(null);

    // Tandai popup berasal dari Continue Watching
    setFromContinueWatching(true);

    // type 0 = movie
    // type 1 = series
    if (media.type === 1) {
      setSelectedSeriesTop(media);
    } else {
      setSelectedMovieTop(media);
    }
  };

  // ========================================
  // MEMBUKA POPUP TOP RATING
  // ========================================

  const handleOpenTopRating = (media: IResponseMovie) => {
    setFromContinueWatching(false);

    setSelectedMovieTop(null);
    setSelectedMovieBottom(null);
    setSelectedSeriesTop(null);

    if (media.type === 1) {
      setSelectedSeriesTop(media);
    } else {
      setSelectedMovieTop(media);
    }
  };

  // ========================================
  // MEMBUKA POPUP MOVIE TOP
  // ========================================

  const handleOpenPopupTop = (media: IResponseMovie) => {
    setFromContinueWatching(false);

    // Tutup semua popup sebelumnya
    setSelectedMovieTop(null);
    setSelectedMovieBottom(null);
    setSelectedSeriesTop(null);

    // Buka popup sesuai jenis media
    if (media.type === 1) {
      setSelectedSeriesTop(media);
    } else {
      setSelectedMovieTop(media);
    }
  };

  // ========================================
  // MEMBUKA POPUP MOVIE BOTTOM
  // ========================================

  const handleOpenPopupBottom = (movie: IResponseMovie) => {
    setFromContinueWatching(false);

    setSelectedMovieTop(null);
    setSelectedSeriesTop(null);
    setSelectedMovieBottom(movie);
  };

  // ========================================
  // MENUTUP POPUP
  // ========================================

  const handleClosePopupTop = () => {
    setSelectedMovieTop(null);
    setFromContinueWatching(false);
  };

  const handleClosePopupBottom = () => {
    setSelectedMovieBottom(null);
    setFromContinueWatching(false);
  };

  const handleCloseSeriesTop = () => {
    setSelectedSeriesTop(null);
    setFromContinueWatching(false);
  };

  // ========================================
  // MEMUTAR EPISODE SERIES
  // ========================================

  const handlePlaySeriesEpisode = (episode: IEpisode) => {
    if (!selectedSeriesTop?.id) return;

    const url =
      `/watch/${selectedSeriesTop.id}` + `?episode=${episode.episode_number}`;

    window.open(url, "_blank");
  };

  // ========================================
  // MENGAMBIL DATA KATALOG
  // ========================================

  useEffect(() => {
    let active = true;

    const getData = async () => {
      try {
        const [movies, series] = await Promise.all([getMovies(), getSeries()]);

        if (!active) return;

        // Acak film untuk Header
        const allMedia = [...movies, ...series];

        const shuffledMedia = [...allMedia].sort(() => Math.random() - 0.5);

        const headerMovie = shuffledMedia.slice(0, 1);

        // Top Rating film dan series
        const topRating = [...movies, ...series]
          .filter((media) => media.top_rating_today === true)
          .sort((a, b) => Number(b.rating) - Number(a.rating));

        // Trending film
        const trending = movies.filter((movie) => movie.is_top_10 === true);

        // Rilis terbaru
        const newRelease = [...movies]
          .sort((a, b) => b.year - a.year)
          .slice(0, 10);

        // Data lengkap untuk Watch History
        setAllMovies(movies);
        setAllSeries(series);

        // Konten Home lainnya
        setMovieHeader(headerMovie);
        setMovieTopRating(topRating);
        setMovieTrending(trending);
        setMovieNewRelease(newRelease);
      } catch (error) {
        console.error("Gagal mengambil katalog Home:", error);
      }
    };

    void getData();

    return () => {
      active = false;
    };
  }, []);

  // ========================================
  // TAMPILAN HOME
  // ========================================

  return (
    <main className="home-page box-pop-up-content">
      <Navbar />

      {/* HEADER */}
      <Header movies={headerMedia} on_click={handleOpenPopupTop} />

      <div className="content">
        {!continueLoading && continueAll.length > 0 && (
          <ContinueMovie
            movies={continueAll}
            on_click={handleOpenContinueWatching}
            headTitle="Melanjutkan Tonton Film dan Series"
          />
        )}

        <TopRatingMovies
          movies={movieTopRating}
          on_click={handleOpenTopRating}
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

      {/* =================================
          POPUP MOVIE TOP
         ================================= */}

      {selectedMovieTop && (
        <PopUpMovieTop
          movie={selectedMovieTop}
          onClose={handleClosePopupTop}
          movies={allMovies}
          onMovieClick={handleOpenPopupTop}
        />
      )}

      {/* =================================
          POPUP MOVIE BOTTOM
         ================================= */}

      {selectedMovieBottom && (
        <PopUpMovieBottom
          movie={selectedMovieBottom}
          onClose={handleClosePopupBottom}
          movies={allMovies}
          onMovieClick={handleOpenPopupBottom}
        />
      )}

      {/* =================================
          POPUP SERIES TOP
         ================================= */}

      {selectedSeriesTop && (
        <PopUpSeriesTop
          movie={selectedSeriesTop}
          onClose={handleCloseSeriesTop}
          onPlayEpisode={handlePlaySeriesEpisode}
          fromContinueWatching={fromContinueWatching}
        />
      )}
    </main>
  );
}
