import "../assets/styles/movies.css";
import { Navbar } from "../layouts/Navbar";
import { HeadTextMovies } from "../components/HeadText";
import { HeadBtn } from "../components/HeadBtn";
import { Footer } from "../layouts/Footer";
import { MoviesContent } from "../components/MoviesContent";

const MoviesPage = () => {
  return (
    <>
      <main className="movies-page">
        <Navbar />
        <header>
          <div className="header">
            <HeadTextMovies />
            <HeadBtn />
          </div>
        </header>
        <MoviesContent />
        <Footer />
      </main>
    </>
  );
};

export default MoviesPage;