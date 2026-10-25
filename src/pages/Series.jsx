import "../assets/styles/series.css";
import { Navbar } from "../layouts/Navbar";
import { HeadTextSeries } from "../components/HeadText";
import { HeadBtn } from "../components/HeadBtn";
import { Footer } from "../layouts/Footer";
import { SeriesContent } from "../components/SeriesContent";

const SeriesPage = () => {
  return (
    <>
      <main className="series-page">
        <Navbar />
        <header>
          <div className="header">
            <HeadTextSeries />
            <HeadBtn />
          </div>
        </header>
        <SeriesContent />
        <Footer />
      </main>
    </>
  );
};

export default SeriesPage;