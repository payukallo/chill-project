import "../assets/styles/index.css";
import { useEffect, useState } from "react";
import { Navbar } from "../layouts/Navbar";
import { Footer } from "../layouts/Footer";
import { Header } from "../components/Header";
import { ContinueMovie } from "../components/Continue";
import { MoviesContainer } from "../components/MoviesContainer";
import { getMovies, getSeries } from "../components/type/MovieApi";
import { useContinueWatching } from "../components/hooks/UseContinueWatching";
import { MoviePopupContent } from "../components/MoviePopupContent";
import { SeriesPopupContent } from "../components/SeriesPopupContent";
import type {
  IEpisode,
  IResponseMovie,
} from "../components/type/IResponMovies";

export default function HomePage() {
  // ========================================
  // DATA KATALOG
  // ========================================

  const [headerMedia, setMovieHeader] = useState<IResponseMovie[]>([]);
  const [movieNewRelease, setMovieNewRelease] = useState<IResponseMovie[]>([]);
  const [movieTopRating, setMovieTopRating] = useState<IResponseMovie[]>([]);
  const [movieTrending, setMovieTrending] = useState<IResponseMovie[]>([]);
  const [mediaFree, setMediaFree] = useState<IResponseMovie[]>([]);
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

  const [selectedSeriesBottom, setSelectedSeriesBottom] =
    useState<IResponseMovie | null>(null);

  // ========================================
  // CONTINUE WATCHING
  // ========================================

  const {
    continueAll,
    loading: continueLoading,
    history,
  } = useContinueWatching({
    movies: allMovies,
    series: allSeries,
  });

  // ========================================
  // MEMBUKA POPUP MOVIE TOP
  // ========================================

  const handleOpenPopupTop = (media: IResponseMovie) => {
    // Tutup semua popup sebelumnya
    setSelectedMovieTop(null);
    setSelectedMovieBottom(null);
    setSelectedSeriesTop(null);
    setSelectedSeriesBottom(null);

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

  const handleOpenPopupBottom = (media: IResponseMovie) => {
    // Tutup semua popup sebelumnya
    setSelectedMovieTop(null);
    setSelectedMovieBottom(null);
    setSelectedSeriesTop(null);
    setSelectedSeriesBottom(null);

    // Buka popup sesuai jenis media
    if (media.type === 1) {
      setSelectedSeriesBottom(media);
    } else {
      setSelectedMovieBottom(media);
    }
  };

  // ========================================
  // MENUTUP POPUP
  // ========================================

  const handleClosePopupTop = () => {
    setSelectedMovieTop(null);
  };

  const handleClosePopupBottom = () => {
    setSelectedMovieBottom(null);
  };

  const handleCloseSeriesTop = () => {
    setSelectedSeriesTop(null);
  };

  const handleCloseSeriesBottom = () => {
    setSelectedSeriesBottom(null);
  };

  // ========================================
  // MEMUTAR EPISODE SERIES
  // ========================================

  const handlePlaySeriesEpisode = (episode: IEpisode) => {
    if (!selectedSeriesTop?.id) return;

    const url =
      `/watch/${selectedSeriesTop.id}` +
      `?type=series&episode=${episode.episode_number}`;

    window.open(url, "_blank", "noopener,noreferrer");
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
        const topRating = [...allMedia]
          .filter((media) => media.top_rating_today === true)
          .sort((a, b) => Number(b.rating) - Number(a.rating));

        // Trending film
        const trending = [...allMedia]
          .filter((movie) => movie.is_top_10 === true)
          .sort(() => Math.random() - 0.5);

        // Rilis terbaru
        const newRelease = [...allMedia]
          .sort((a, b) => b.year - a.year)
          .slice(0, 10);

        // Film dan series gratis
        const free = [...allMedia]
          .filter((media) => media.is_premium === false)
          .sort(() => Math.random() - 0.5);

        // Data lengkap untuk Watch History
        setAllMovies(movies);
        setAllSeries(series);

        // Konten Home lainnya
        setMovieHeader(headerMovie);
        setMovieTopRating(topRating);
        setMovieTrending(trending);
        setMovieNewRelease(newRelease);
        setMediaFree(free);
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
      <Header
        movies={headerMedia}
        on_click={handleOpenPopupTop}
        historyLoading={continueLoading}
        history={history}
      />

      <div className="content">
        <ContinueMovie
          movies={continueAll}
          on_click={handleOpenPopupTop}
          headTitle="Melanjutkan Tonton Film dan Series"
          history={history}
        />

        <MoviesContainer
          movies={movieTopRating}
          on_click={handleOpenPopupTop}
          headTitle="Top Rating Film dan Series Hari ini"
          history={history}
        />

        <MoviesContainer
          movies={movieTrending}
          headTitle="Film dan Series Trending"
          on_click={handleOpenPopupBottom}
          history={history}
        />

        <MoviesContainer
          movies={movieNewRelease}
          headTitle="Rilis Baru"
          on_click={handleOpenPopupBottom}
          history={history}
        />

        <MoviesContainer
          movies={mediaFree}
          headTitle="Film dan Series Gratis"
          on_click={handleOpenPopupBottom}
          history={history}
        />
      </div>

      <Footer />

      {/* =================================
          POPUP MOVIE
         ================================= */}

      {selectedMovieTop && (
        <MoviePopupContent
          movie={selectedMovieTop}
          onClose={handleClosePopupTop}
          movies={allMovies}
          onMovieClick={handleOpenPopupTop}
          variant="top"
        />
      )}

      {selectedMovieBottom && (
        <MoviePopupContent
          movie={selectedMovieBottom}
          onClose={handleClosePopupBottom}
          movies={allMovies}
          onMovieClick={handleOpenPopupBottom}
          variant="bottom"
        />
      )}

      {/* =================================
          POPUP SERIES
         ================================= */}

      {selectedSeriesTop && (
        <SeriesPopupContent
          movie={selectedSeriesTop}
          onClose={handleCloseSeriesTop}
          onPlayEpisode={handlePlaySeriesEpisode}
          variant="top"
        />
      )}

      {selectedSeriesBottom && (
        <SeriesPopupContent
          movie={selectedSeriesBottom}
          onClose={handleCloseSeriesBottom}
          onPlayEpisode={handlePlaySeriesEpisode}
          variant="bottom"
        />
      )}
    </main>
  );
}
