import "../assets/styles/myList.css";
import { useEffect, useState } from "react";
import { Navbar } from "../layouts/Navbar.jsx";
import { Footer } from "../layouts/Footer.jsx";
import { getMovies } from "../components/type/MovieApi";
import { PopUpMyList } from "../components/PopUpMyList.js";
import { MyListContainer } from "../components/MyListContainer";
import type { IMyListMovie } from "../stores/useMyListStore";
import type { IResponseMovie } from "../components/type/IResponMovies";

const MyListPage = () => {
  const [selectedMovie, setSelectedMovie] = useState<IMyListMovie | null>(null);

  function handleOpenPopup(movie: IMyListMovie) {
    console.log("FILM DIKLIK:", movie);
    setSelectedMovie(movie);
  }

  function handleClosePopup() {
    setSelectedMovie(null);
  }

  const [movies, setMovies] = useState<IResponseMovie[]>([]);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await getMovies();
        setMovies(data);
      } catch (error) {
        console.error("Gagal mengambil katalog film:", error);
      }
    }

    fetchMovies();
  }, []);

  console.log("SELECTED MOVIE:", selectedMovie);

  return (
    <main className="my-list-page box-pop-up-content">
      <Navbar />

      <div className="my-list">
        <span className="list-title heading-3">Daftar Saya</span>
        <MyListContainer onMovieClick={handleOpenPopup} movies={[]} />
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
