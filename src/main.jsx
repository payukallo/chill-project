import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router/index";
import { MyListProvider } from "./assets/context/MyListContext";

import "./assets/styles/main.css";

const app = document.getElementById("root");
const root = createRoot(app);

if (!app) {
  throw new Error("Element root tidak ditemukan");
}

root.render(
  <MyListProvider>
    <RouterProvider router={router} />
  </MyListProvider>
);