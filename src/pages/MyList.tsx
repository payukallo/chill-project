import "../assets/styles/myList.css";
import { Navbar } from "../layouts/Navbar.jsx";
import { MyListMovies } from "../components/MyListMovies.jsx";
import { Footer } from "../layouts/Footer.jsx";

const MyListPage = () => {
  return (
    <main className="my-list-page box-pop-up-content">
      <Navbar />
      <MyListMovies />
      <Footer />
    </main>
  );
};

export default MyListPage;
