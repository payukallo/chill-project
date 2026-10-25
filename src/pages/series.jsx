import "../assets/styles/series.css";
import { Navbar } from "../components/navbar";
import { HeadTextSeries } from "../components/headText";
import { HeadBtn } from "../components/headBtn";
import { Footer } from "../components/footer";
import { SeriesContent } from "../components/seriesContent";

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