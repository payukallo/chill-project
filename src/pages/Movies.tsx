import "../assets/styles/movies.css";
import MovieImg from "../assets/images/navbar-img-movies.png";
import { Navbar } from "../layouts/Navbar";
import { Header } from "../assets/headerComponent/Header";
import { MoviesContent } from "../components/MoviesContent";
import { Footer } from "../layouts/Footer";


const MoviesPage = () => {
  return (
    <main className="movies-page">
      <Navbar />
      <Header
        image={MovieImg}
        title={"Avatar 3"}
        description={
        "Avatar 3 melanjutkan cerita konflik antara manusia dan Na'vi di planet Pandora. Dalam pertempuran untuk sumber daya dan kekuasaan, manusia dan sekutu Na'vi bersatu untuk melindungi tanah mereka. Film ini mengangkat tema persatuan dan perlawanan terhadap eksploitasi."
        }
      />
      <MoviesContent />
      <Footer />
    </main>
  );
};

export default MoviesPage;
