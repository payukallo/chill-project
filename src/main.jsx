import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router/index";
import "./assets/styles/main.css";

const app = document.getElementById("root");
const root = createRoot(app);

root.render(<RouterProvider router={router} />);
