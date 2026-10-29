import "../assets/styles/index.css";
import { Navbar } from "../layouts/Navbar";
import { Header } from "../components/headerComponent/Header";
import { HomeContent } from "../components/HomeContent";
import { Footer } from "../layouts/Footer";

const HomePage = () => {
  return (
    <main className="home-page box-pop-up-content">
      <Navbar />
      <Header />
      <HomeContent />
      <Footer />
    </main>
  );
};

export default HomePage;
