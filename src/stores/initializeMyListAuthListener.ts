import { supabase } from "../components/utils/supabase";
import { useMyListStore } from "./useMyListStore";

// Menghindari hasil request lama menimpa data terbaru
let requestId = 0;

export function initializeMyListAuthListener() {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      requestId++;
      useMyListStore.getState().setMyMovies([]);
      return;
    }

    if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
      const userId = session?.user.id;

      if (!userId) {
        requestId++;
        useMyListStore.getState().setMyMovies([]);
        return;
      }

      useMyListStore.getState().setMyMovies([]);

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        void useMyListStore.getState().fetchMyList(userId);
      }, 0);
    }
  });

  return () => {
    requestId++;

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    subscription.unsubscribe();
  };
}
