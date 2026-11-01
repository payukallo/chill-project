import { createContext, useContext, useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import type { IResponseMovie } from "../../components/type/IResponMovies";
import { supabase } from "../utils/supabase";

export interface IMyListMovie extends Omit<IResponseMovie, "id"> {
  id: string;
  myListId: string;
  mediaType: "movie" | "series";
}

interface IMyListRecord {
  id: string;
  media_id: string;
  media_type: "movie" | "series";
}

interface IMediaRow {
  id: string;
  data: IResponseMovie;
}

interface IMyListContext {
  myMovies: IMyListMovie[];

  toggleMyList: (movie: IResponseMovie | IMyListMovie) => Promise<void>;

  isInMyList: (
    movieId: string | number,
    mediaType?: "movie" | "series",
  ) => boolean;
}

const MyListContext = createContext<IMyListContext | undefined>(undefined);

interface IMyListProvider {
  children: ReactNode;
}

export function MyListProvider({ children }: IMyListProvider) {
  const [myMovies, setMyMovies] = useState<IMyListMovie[]>([]);

  const pendingMovies = useRef(new Set<string>());

  // =========================
  // READ MY LIST
  // =========================

  useEffect(() => {
    let requestId = 0;

    async function fetchMyList(userId: string) {
      const currentRequest = ++requestId;

      try {
        const { data: records, error } = await supabase
          .from("my_list")
          .select("id, media_id, media_type")
          .eq("user_id", userId);

        if (error) throw error;

        const myListRecords = (records ?? []) as IMyListRecord[];

        const movieIds = myListRecords
          .filter((item) => item.media_type === "movie")
          .map((item) => item.media_id);

        const seriesIds = myListRecords
          .filter((item) => item.media_type === "series")
          .map((item) => item.media_id);

        // Mengambil detail film
        let movieData: IMediaRow[] = [];

        if (movieIds.length > 0) {
          const { data, error } = await supabase
            .from("movies")
            .select("id, data")
            .in("id", movieIds);

          if (error) throw error;

          movieData = (data ?? []) as IMediaRow[];
        }

        // Mengambil detail series
        let seriesData: IMediaRow[] = [];

        if (seriesIds.length > 0) {
          const { data, error } = await supabase
            .from("series")
            .select("id, data")
            .in("id", seriesIds);

          if (error) throw error;

          seriesData = (data ?? []) as IMediaRow[];
        }

        // Menggabungkan film dan series
        const allMedia = [
          ...movieData.map((item) => ({
            ...item,
            mediaType: "movie" as const,
          })),

          ...seriesData.map((item) => ({
            ...item,
            mediaType: "series" as const,
          })),
        ];

        // Membentuk data My List
        const formattedData: IMyListMovie[] = myListRecords
          .map((record) => {
            const media = allMedia.find(
              (item) =>
                item.id === record.media_id &&
                item.mediaType === record.media_type,
            );

            if (!media) return null;

            return {
              ...media.data,
              id: record.media_id,
              myListId: record.id,
              mediaType: record.media_type,
            };
          })
          .filter((item): item is IMyListMovie => item !== null);

        // Mencegah request lama menimpa data terbaru
        if (currentRequest === requestId) {
          setMyMovies(formattedData);
        }
      } catch (error) {
        console.error("Gagal mengambil My List:", error);
      }
    }

    // Memantau perubahan autentikasi
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        requestId++;
        setMyMovies([]);
        return;
      }

      if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        const userId = session?.user.id;

        if (!userId) {
          requestId++;
          setMyMovies([]);
          return;
        }

        setMyMovies([]);

        setTimeout(() => {
          void fetchMyList(userId);
        }, 0);
      }
    });

    return () => {
      requestId++;
      subscription.unsubscribe();
    };
  }, []);

  // =========================
  // CREATE DAN DELETE
  // =========================

  async function toggleMyList(movie: IResponseMovie | IMyListMovie) {
    if (movie.id == null) return;

    const movieId = String(movie.id);

    const mediaType: "movie" | "series" = movie.type === 1 ? "movie" : "series";

    const pendingKey = `${mediaType}:${movieId}`;

    // Mencegah klik berulang ketika request berjalan
    if (pendingMovies.current.has(pendingKey)) return;

    pendingMovies.current.add(pendingKey);

    const existingMovie = myMovies.find(
      (item) => String(item.id) === movieId && item.mediaType === mediaType,
    );

    // Menyimpan state sebelumnya untuk rollback
    const previousMovies = myMovies;

    try {
      // OPTIMISTIC UI
      if (existingMovie) {
        // Hapus dari tampilan
        setMyMovies((prev) =>
          prev.filter((item) => item.myListId !== existingMovie.myListId),
        );
      } else {
        // Tambahkan ke tampilan
        const temporaryMovie: IMyListMovie = {
          ...movie,
          id: movieId,
          myListId: `temp-${mediaType}-${movieId}`,
          mediaType,
        };

        setMyMovies((prev) => [...prev, temporaryMovie]);
      }

      // Memeriksa pengguna yang sedang login
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        throw new Error("Silakan login terlebih dahulu.");
      }

      // DELETE
      if (existingMovie) {
        const { error } = await supabase
          .from("my_list")
          .delete()
          .eq("id", existingMovie.myListId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // CREATE
        const { data, error } = await supabase
          .from("my_list")
          .insert({
            user_id: user.id,
            media_id: movieId,
            media_type: mediaType,
          })
          .select("id")
          .single();

        if (error) throw error;

        // Mengganti ID sementara dengan ID asli Supabase
        setMyMovies((prev) =>
          prev.map((item) =>
            item.myListId === `temp-${mediaType}-${movieId}`
              ? {
                  ...item,
                  myListId: data.id,
                }
              : item,
          ),
        );
      }
    } catch (error) {
      console.error("Gagal memperbarui My List:", error);

      // Mengembalikan state sebelumnya jika gagal
      setMyMovies(previousMovies);
    } finally {
      pendingMovies.current.delete(pendingKey);
    }
  }

  // =========================
  // CHECK MY LIST
  // =========================

  function isInMyList(
    movieId: string | number,
    mediaType?: "movie" | "series",
  ) {
    return myMovies.some(
      (item) =>
        String(item.id) === String(movieId) &&
        (!mediaType || item.mediaType === mediaType),
    );
  }

  // =========================
  // PROVIDER
  // =========================

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

// =========================
// CUSTOM HOOK
// =========================

export function useMyList() {
  const context = useContext(MyListContext);

  if (!context) {
    throw new Error("useMyList harus digunakan di dalam MyListProvider");
  }

  return context;
}
