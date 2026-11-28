import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router/index";
import "./assets/styles/main.css";

const app = document.getElementById("root");

if (!app) {
  throw new Error("Element root tidak ditemukan");
}

// Muat My List hanya jika pengguna sudah login.
if (localStorage.getItem("token")) {
  void import("./stores/initializeMyListAuthListener")
    .then(({ initializeMyListAuthListener }) => {
      initializeMyListAuthListener();
    })
    .catch((error) => {
      console.error("Gagal menginisialisasi My List:", error);
    });
}

function PageLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        backgroundColor: "#181A1C",
        color: "#ffffff",
      }}
    >
      Memuat halaman...
    </div>
  );
}

createRoot(app).render(
  <Suspense fallback={<PageLoading />}>
    <RouterProvider router={router} />
  </Suspense>
);
