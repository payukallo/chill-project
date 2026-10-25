import "../assets/styles/index.css";
import { Navbar } from "../components/navbar";
import { HeadTextHome } from "../components/headText";
import { HeadBtn } from "../components/headBtn";
import { HomeContent } from "../components/homeContent";
import { Footer } from "../components/footer";

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
