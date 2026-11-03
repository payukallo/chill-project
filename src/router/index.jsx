import { createBrowserRouter } from "react-router";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import HomePage from "../pages/Home";
import MyListPage from "../pages/MyList";
import SeriesPage from "../pages/Series";
import MoviesPage from "../pages/Movies";
import ProfilePage from "../pages/Profile";
import WatchMoviePage from "../pages/WatchMovie";
import { ProtectedRoute, PublicRoute } from "../components/ProtectedRoute";
import SubscriptionPage from "../pages/Subscription";

export const router = createBrowserRouter([
  // Halaman khusus pengguna yang belum login
  {
    Component: PublicRoute,
    children: [
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/register",
        Component: RegisterPage,
      },
    ],
  },

  // Halaman khusus pengguna yang sudah login
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
      {
        path: "/profile",
        Component: ProfilePage,
      },
       {
        path: "/subscription",
        Component: SubscriptionPage,
      },
      {
        path: "/watch/:id",
        Component: WatchMoviePage,
      },
    ],
  },
]);
