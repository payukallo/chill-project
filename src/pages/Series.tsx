import "../assets/styles/index.css";
import { useEffect, useState } from "react";
import { Navbar } from "../layouts/Navbar";
import { Header } from "../components/Header";
import { Footer } from "../layouts/Footer";
import { getSeries } from "../components/type/MovieApi";
import { NewRelease } from "../components/NewRelease";
import { ContinueMovie } from "../components/Continue";
import { TrendingMovies } from "../components/Trending";
import { TopRatingMovies } from "../components/TopRating";
import { MoviesFromChill } from "../components/FromChill ";
import { PopUpSeriesBottom } from "../components/PopUpSeriesBottom";
import { PopUpSeriesTop } from "../components/PopUpSeriesTop";
import { useContinueWatching } from "../components/hooks/UseContinueWatching";
import type {
  IResponseMovie,
  IEpisode,
} from "../components/type/IResponMovies";

export default function SeriesPage() {
  // ========================================
  // DATA KATALOG SERIES
  // ========================================

  const [movieHeader, setMovieHeader] = useState<IResponseMovie[]>([]);
  const [movieFromChill, setMovieFromChill] = useState<IResponseMovie[]>([]);
  const [movieTopRating, setMovieTopRating] = useState<IResponseMovie[]>([]);
  const [movieTrending, setMovieTrending] = useState<IResponseMovie[]>([]);
  const [movieNewRelease, setMovieNewRelease] = useState<IResponseMovie[]>([]);
  const [allSeries, setAllSeries] = useState<IResponseMovie[]>([]);
  const [fromContinueWatching, setFromContinueWatching] = useState(false);

  // ========================================
  // POPUP
  // ========================================

  const [selectedMovieTop, setSelectedMovieTop] =
    useState<IResponseMovie | null>(null);
  const [selectedMovieBottom, setSelectedMovieBottom] =
    useState<IResponseMovie | null>(null);

  // ========================================
  // CONTINUE WATCHING SERIES
  // ========================================

  const {
    continueSeries,
    loading: continueLoading,
    history,
  } = useContinueWatching({
    movies: [],
    series: allSeries,
  });

  // ========================================
  // EVENT POPUP
  // ========================================

  const handleOpenContinueSeries = (series: IResponseMovie) => {
    setSelectedMovieBottom(null);
    setFromContinueWatching(true);
    setSelectedMovieTop(series);
  };

  const handleOpenPopupTop = (movie: IResponseMovie) => {
    setSelectedMovieBottom(null);
    setSelectedMovieTop(movie);
    setFromContinueWatching(false);
  };

  const handleOpenPopupBottom = (movie: IResponseMovie) => {
    setSelectedMovieTop(null);
    setSelectedMovieBottom(movie);
    setFromContinueWatching(false);
  };

  const handleClosePopupTop = () => {
    setSelectedMovieTop(null);
  };

  const handleClosePopupBottom = () => {
    setSelectedMovieBottom(null);
  };

  // ========================================
  // MEMUTAR EPISODE
  // ========================================

  const handlePlayEpisodeTop = (episode: IEpisode) => {
    if (!selectedMovieTop?.id) return;

    const url = `/watch/${selectedMovieTop.id}?episode=${episode.episode_number}`;

    window.open(url, "_blank");
  };

  const handlePlayEpisodeBottom = (episode: IEpisode) => {
    if (!selectedMovieBottom?.id) return;

    const url = `/watch/${selectedMovieBottom.id}?episode=${episode.episode_number}`;

    window.open(url, "_blank");
  };

  // ========================================
  // MENGAMBIL KATALOG SERIES
  // ========================================

  useEffect(() => {
    let active = true;

    const getData = async () => {
      try {
        const series = await getSeries();

        if (!active) return;

        const shuffledSeries = [...series].sort(() => Math.random() - 0.5);
        const headerSeries = shuffledSeries.slice(0, 1);
        const fromChill = series.filter((item) => item.is_premium === true);
        const topRating = series.filter(
          (item) => item.top_rating_today === true,
        );

        const trending = series.filter((item) => item.is_top_10 === true);
        const newRelease = [...series]
          .sort((a, b) => b.year - a.year)
          .slice(0, 10);

        // Katalog lengkap untuk mencocokkan Watch History
        setAllSeries(series);

        // Konten halaman Series lainnya
        setMovieHeader(headerSeries);
        setMovieFromChill(fromChill);
        setMovieTopRating(topRating);
        setMovieTrending(trending);
        setMovieNewRelease(newRelease);
      } catch (error) {
        console.error("Gagal mengambil katalog Series:", error);
      }
    };

    getData();

    return () => {
      active = false;
    };
  }, []);

  // ========================================
  // TAMPILAN SERIES
  // ========================================

  return (
    <main className="home-page box-pop-up-content">
      <Navbar />

      <Header
        movies={movieHeader}
        on_click={handleOpenPopupTop}
        history={history}
        historyLoading={continueLoading}
      />

      <div className="content">
        {!continueLoading && continueSeries.length > 0 && (
          <ContinueMovie
            movies={continueSeries}
            on_click={handleOpenContinueSeries}
            headTitle="Melanjutkan Tonton Series"
            history={history}
          />
        )}

        <MoviesFromChill
          movies={movieFromChill}
          on_click={handleOpenPopupTop}
          headTitle="Series Persembahan Chill"
          history={history}
        />

        <TopRatingMovies
          movies={movieTopRating}
          on_click={handleOpenPopupBottom}
          headTitle="Top Rating Series Hari ini"
          history={history}
        />

        <TrendingMovies
          movies={movieTrending}
          headTitle="Series Trending"
          on_click={handleOpenPopupBottom}
          history={history}
        />

        <NewRelease
          movies={movieNewRelease}
          headTitle="Rilis Baru"
          on_click={handleOpenPopupBottom}
          history={history}
        />
      </div>

      <Footer />

      {/* Popup Series Top */}
      {selectedMovieTop && (
        <PopUpSeriesTop
          movie={selectedMovieTop}
          onClose={handleClosePopupTop}
          onPlayEpisode={handlePlayEpisodeTop}
          fromContinueWatching={fromContinueWatching}
        />
      )}

      {/* Popup Series Bottom */}
      {selectedMovieBottom && (
        <PopUpSeriesBottom
          movie={selectedMovieBottom}
          onClose={handleClosePopupBottom}
          onPlayEpisode={handlePlayEpisodeBottom}
        />
      )}
    </main>
  );
}
