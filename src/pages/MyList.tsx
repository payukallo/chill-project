import "../assets/styles/myList.css";
import { useEffect, useState } from "react";
import { Navbar } from "../layouts/Navbar.jsx";
import { Footer } from "../layouts/Footer.jsx";
import type { IResponseMovie } from "../components/type/IResponMovies.js";
import { PopUpMyList } from "../components/PopUpMyList.js";
import { MyListContainer } from "../components/MyListContainer";

const MyListPage = () => {
  const [movies, setMovies] = useState<IResponseMovie[]>([]);

  const [selectedMovie, setSelectedMovie] = useState<IResponseMovie | null>(
    null,
  );

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch("VITE_API_MOVIES_URL");

        if (!response.ok) {
          throw new Error("Gagal mengambil data movies");
        }

        const data: IResponseMovie[] = await response.json();

        setMovies(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMovies();
  }, []);

  function handleOpenPopup(movie: IResponseMovie) {
    setSelectedMovie(movie);
  }

  function handleClosePopup() {
    setSelectedMovie(null);
  }

  return (
    <main className="my-list-page box-pop-up-content">
      <Navbar />
      <div className="my-list">
        <span className="list-title heading-3">Daftar Saya</span>
        <MyListContainer onMovieClick={handleOpenPopup} />
      </div>
      {selectedMovie && (
        <PopUpMyList movie={selectedMovie} onClose={handleClosePopup} />
      )}
      <Footer />
    </main>
  );
};

export default MyListPage;
