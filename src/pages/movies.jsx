import "../assets/styles/movies.css";
import { Navbar } from "../components/navbar";
import { HeadTextMovies } from "../components/headText";
import { HeadBtn } from "../components/headBtn";
import { Footer } from "../components/footer";
import { MoviesContent } from "../components/moviesContent";

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