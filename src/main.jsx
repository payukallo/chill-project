import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router/index";

import "./assets/styles/main.css";
import { initializeMyListAuthListener } from "./stores/initializeMyListAuthListener";

const app = document.getElementById("root");

if (!app) {
  throw new Error("Element root tidak ditemukan");
}

// Memulai pemantauan autentikasi Supabase
initializeMyListAuthListener();

createRoot(app).render(<RouterProvider router={router} />);
