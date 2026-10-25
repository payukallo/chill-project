import "../assets/styles/index.css";
import { Navbar } from "../layouts/Navbar";
import { HeadTextHome } from "../components/HeadText";
import { HeadBtn } from "../components/HeadBtn";
import { HomeContent } from "../components/HomeContent";
import { Footer } from "../layouts/Footer";

const HomePage = () => {
  return (
    <>
      <main className="home-page">
        <Navbar />
        <header>
          <div className="header">
            <HeadTextHome />
            <HeadBtn />
          </div>
        </header>
        <HomeContent />
        <Footer />
      </main>
    </>
  );
};

export default HomePage;
