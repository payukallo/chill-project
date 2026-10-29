import "../assets/styles/movies.css";
import { Navbar } from "../layouts/Navbar";
import { MoviesContent } from "../components/MoviesContent";
import { Footer } from "../layouts/Footer";
import { HeaderMovies } from "../components/headerComponent/HeaderMovies";


const MoviesPage = () => {
  return (
    <main className="movies-page box-pop-up-content">
      <Navbar />
      <HeaderMovies/>
      <MoviesContent />
      <Footer />
    </main>
  );
};

export default MoviesPage;
