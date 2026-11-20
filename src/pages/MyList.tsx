import "../assets/styles/myList.css";
import { useEffect, useState } from "react";
import { Navbar } from "../layouts/Navbar";
import { Footer } from "../layouts/Footer";
import { getMovies, getSeries } from "../components/type/MovieApi";
import { PopUpMyList } from "../components/PopUpMyList";
import { MyListContainer } from "../components/MyListContainer";
import { useContinueWatching } from "../components/hooks/UseContinueWatching";
import type { IMyListMovie } from "../stores/useMyListStore";
import type { IResponseMovie } from "../components/type/IResponMovies";

const MyListPage = () => {
  const [selectedMovie, setSelectedMovie] = useState<IMyListMovie | null>(null);
  const [movies, setMovies] = useState<IResponseMovie[]>([]);
  const [series, setSeries] = useState<IResponseMovie[]>([]);

  // WATCH HISTORY
  const { history, loading: historyLoading } = useContinueWatching({
    movies,
    series,
  });

  // POPUP
  const handleOpenPopup = (movie: IMyListMovie) => {
    setSelectedMovie(movie);
  };

  const handleClosePopup = () => {
    setSelectedMovie(null);
  };

  // DATA KATALOG
  useEffect(() => {
    let active = true;

    const fetchCatalog = async () => {
      try {
        const [movieData, seriesData] = await Promise.all([
          getMovies(),
          getSeries(),
        ]);

        if (!active) return;

        setMovies(movieData);
        setSeries(seriesData);
      } catch (error) {
        console.error("Gagal mengambil katalog:", error);
      }
    };

    void fetchCatalog();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="my-list-page box-pop-up-content">
      <Navbar />

      <div className="my-list">
        <span className="list-title heading-3">Daftar Saya</span>

        {!historyLoading && (
          <MyListContainer
            onMovieClick={handleOpenPopup}
            movies={[...movies, ...series]}
            history={history}
          />
        )}
      </div>

      {selectedMovie && (
        <PopUpMyList
          movie={selectedMovie}
          movies={movies}
          onClose={handleClosePopup}
        />
      )}

      <Footer />
    </main>
  );
};

export default MyListPage;
