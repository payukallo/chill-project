import { createBrowserRouter } from "react-router";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import HomePage from "../pages/home";
import MyListPage from "../pages/myList";
import SeriesPage from "../pages/series";
import MoviesPage from "../pages/movies";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
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
]);
