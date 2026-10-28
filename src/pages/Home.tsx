import "../assets/styles/index.css";
import MovieImg from "../assets/images/navbar-img.png";
import { Navbar } from "../layouts/Navbar";
import { Header } from "../components/headerComponent/Header";
import { HomeContent } from "../components/HomeContent";
import { Footer } from "../layouts/Footer";

const HomePage = () => {
  return (
    <main className="home-page box-pop-up-content">
      <Navbar />
      <Header
      image={MovieImg}
        title={"Duty After School"}
        description={
          "Sebuah benda tak di kenal mengambil ahli dunia. Dalam keputusasaan, Departement Pertahanan mulai merekrut lebih banyak tentara, termasuk siswa sekolah menengah. Mereka pun segera menjadi pejuang garis depan dalam perang."
        }
      />
      <HomeContent />
      <Footer />
    </main>
  );
};

export default HomePage;
