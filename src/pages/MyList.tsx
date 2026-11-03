import "../assets/styles/myList.css";
import type { IResponseMovie } from "../components/type/IResponMovies";
import { useState } from "react";
import { Navbar } from "../layouts/Navbar.jsx";
import { Footer } from "../layouts/Footer.jsx";
import { PopUpMyList } from "../components/PopUpMyList.js";
import { MyListContainer } from "../components/MyListContainer";
import type { IMyListMovie } from "../stores/useMyListStore";

const MyListPage = () => {
  const [selectedMovie, setSelectedMovie] = useState<IMyListMovie | null>(null);

  function handleOpenPopup(movie: IMyListMovie) {
    setSelectedMovie(movie);
  }

  function handleClosePopup() {
    setSelectedMovie(null);
  }

  const [allMovies] = useState<IResponseMovie[]>([]);

  return (
    <main className="my-list-page box-pop-up-content">
      <Navbar />

      <div className="my-list">
        <span className="list-title heading-3">Daftar Saya</span>

        <MyListContainer onMovieClick={handleOpenPopup} />
      </div>

      {selectedMovie && (
        <PopUpMyList
          movie={selectedMovie}
          movies={allMovies}
          onClose={handleClosePopup}
        />
      )}

      <Footer />
    </main>
  );
};

export default MyListPage;
