
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

import type { ReactNode } from "react";
import { IResponseMovie } from "../../components/type/IResponMovies";


const API_URL = "http://localhost:3000";

interface IMyListMovie extends IResponseMovie {
  myListId: string | number;
}

interface IMyListContext {
  myMovies: IMyListMovie[];
  toggleMyList: (movie: IResponseMovie) => Promise<void>;
  isInMyList: (movieId: string | number) => boolean;
}

const MyListContext = createContext<IMyListContext | undefined>(
  undefined
);

interface IMyListProvider {
  children: ReactNode;
}

export function MyListProvider({ children }: IMyListProvider) {
  const [myMovies, setMyMovies] = useState<IMyListMovie[]>([]);
  const pendingMovies = useRef(new Set<string>());

  // READ
  useEffect(() => {
    async function fetchMyList() {
      try {
        const response = await fetch(`${API_URL}/myList`);

        if (!response.ok) {
          throw new Error("Gagal mengambil data My List");
        }

        const data = await response.json();

        const formattedData: IMyListMovie[] = data.map(
          (item: IResponseMovie & {
            movieId?: string | number;
          }) => ({
            ...item,
            id: item.movieId ?? item.id,
            myListId: item.id!,
          })
        );

        setMyMovies(formattedData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMyList();
  }, []);

  // CREATE dan DELETE
  async function toggleMyList(movie: IResponseMovie) {
    if (movie.id == null) return;

    const movieId = String(movie.id);

    if (pendingMovies.current.has(movieId)) return;

    pendingMovies.current.add(movieId);

    const existingMovie = myMovies.find(
      (item) => String(item.id) === movieId
    );

    try {
      if (existingMovie) {
        // DELETE menggunakan ID record My List
        const response = await fetch(
          `${API_URL}/myList/${existingMovie.myListId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Gagal menghapus film");
        }

        setMyMovies((prevMovies) =>
          prevMovies.filter(
            (item) => String(item.id) !== movieId
          )
        );
      } else {
        // CREATE
        const { id, ...movieData } = movie;

        const response = await fetch(`${API_URL}/myList`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...movieData,
            movieId: id,
          }),
        });

        if (!response.ok) {
          throw new Error("Gagal menambahkan film");
        }

        const savedMovie = await response.json();

        const newMovie: IMyListMovie = {
          ...savedMovie,
          id: savedMovie.movieId,
          myListId: savedMovie.id,
        };

        setMyMovies((prevMovies) => [...prevMovies, newMovie]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      pendingMovies.current.delete(movieId);
    }
  }

  // CHECK
  function isInMyList(movieId: string | number) {
    return myMovies.some(
      (item) => String(item.id) === String(movieId)
    );
  }

  return (
    <MyListContext.Provider
      value={{
        myMovies,
        toggleMyList,
        isInMyList,
      }}
    >
      {children}
    </MyListContext.Provider>
  );
}

export function useMyList() {
  const context = useContext(MyListContext);

  if (!context) {
    throw new Error(
      "useMyList harus digunakan di dalam MyListProvider"
    );
  }

  return context;
}
