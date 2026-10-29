import "../assets/styles/series.css";
import { Navbar } from "../layouts/Navbar";
import { SeriesContent } from "../components/SeriesContent";
import { Footer } from "../layouts/Footer";
import { HeaderSeries } from "../components/headerComponent/HeaderSeries";

const SeriesPage = () => {
  return (
    <main className="series-page box-pop-up-content">
      <Navbar />
      <HeaderSeries/>
      <SeriesContent />
      <Footer />
    </main>
  );
};

export default SeriesPage;
