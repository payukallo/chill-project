import { createBrowserRouter } from "react-router";

import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import HomePage from "../pages/Home";
import MyListPage from "../pages/MyList";
import SeriesPage from "../pages/Series";
import MoviesPage from "../pages/Movies";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    Component: ProtectedRoute,
    children: [
      {
        path: "/",
        Component: HomePage,
      },
      {
        path: "/my_list",
        Component: MyListPage,
      },
      {
        path: "/series",
        Component: SeriesPage,
      },
      {
        path: "/movies",
        Component: MoviesPage,
      },
    ],
  },
]);