import "../assets/styles/series.css";
import MovieImg from "../assets/images/navbar-img-series.png";
import { Navbar } from "../layouts/Navbar";
import { Header } from "../assets/headerComponent/Header";
import { SeriesContent } from "../components/SeriesContent";
import { Footer } from "../layouts/Footer";

const SeriesPage = () => {
  return (
    <main className="series-page">
      <Navbar />
      <Header
      image={MovieImg}
        title={"Happiness"}
        description={
          "Mengisahkan tentang kelompok orang yang berjuang untuk bertahan hidup di dalam sebuah gedung apartemen yang penuh dengan zombie. Sayangnya, virus zombie hanya terdapat di dalam area apartemen tersebut dan tidak menyebar ke luar kawasan apartemen."
        }
      />
      <SeriesContent />
      <Footer />
    </main>
  );
};

export default SeriesPage;
