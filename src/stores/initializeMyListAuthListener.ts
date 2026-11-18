import { useMyListStore } from "./useMyListStore";

export function initializeMyListAuthListener() {
  const token = localStorage.getItem("token");

  if (token) {
    void useMyListStore.getState().fetchMyList();
  } else {
    useMyListStore.getState().setMyMovies([]);
  }

  // Mengembalikan fungsi cleanup
  return () => {
    useMyListStore.getState().setMyMovies([]);
  };
}
