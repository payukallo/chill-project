import "../assets/styles/myList.css";
import { Footer } from "../layouts/Footer.jsx";
import { Navbar } from "../layouts/Navbar.jsx";
import { MyListMovies } from "../components/MyListMovies.jsx";

const MyListPage = () => {
  return (
    <>
      <main className="my-list-page">
        <Navbar />
        <MyListMovies />
        <Footer />
      </main>
    </>
  );
};

export default MyListPage;
