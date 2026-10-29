import { createContext, useContext, useState } from "react";
import { BoxMovie } from "../../components/BoxMovie";

export interface IMovie {
  movieImg: string;
  isPremium: boolean;
  isTop10: boolean;
  isNewEpisode: boolean;
  title: string;
  rating: string;
  year: string;
  duration: string;
  movieDescription: string;
  ageRecommendation: string;
  recommendationMovie1: number;
  recommendationMovie2: number;
  recommendationMovie3: number;
  cast: string;
  genre: string;
  filmMaker: string;
}

interface IMyListContext {
  myMovies: IMovie[];
  addMovie: (movie: IMovie) => void;
}

const MyListContext = createContext<IMyListContext | null>(null);

export function MyListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [myMovies, setMyMovies] = useState<IMovie[]>([]);

  const addMovie = (movie: IMovie) => {
    setMyMovies((prev) => {
      if (prev.some((item) => item.title === movie.title)) {
        return prev;
      }

      return [...prev, movie];
    });
  };

  return (
    <MyListContext.Provider value={{ myMovies, addMovie }}>
      {children}
    </MyListContext.Provider>
  );
}

export function useMyList() {
  const context = useContext(MyListContext);

  if (!context) {
    throw new Error("useMyList harus digunakan di dalam MyListProvider");
  }

  return context;
}

export function MyMoviesList() {
  const { myMovies } = useMyList();

  return (
    <section>
      <h2>Daftar Film Saya</h2>

      <div className="list-container">
        {myMovies.map((movie) => (
          <div className="list-box" key={movie.title}>
            <BoxMovie id={0} totalEpisode={""} {...movie} />
          </div>
        ))}
      </div>
    </section>
  );
}