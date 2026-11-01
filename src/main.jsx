import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router/index";

import "./assets/styles/main.css";
import { MyListProvider } from "./components/context/MyListContext";

const app = document.getElementById("root");

if (!app) {
  throw new Error("Element root tidak ditemukan");
}

createRoot(app).render(
  <MyListProvider>
    <RouterProvider router={router} />
  </MyListProvider>,
);
