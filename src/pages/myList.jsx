import "../assets/styles/myList.css";
import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";
import { MyListMovies } from "../components/myListMovies.jsx";

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
