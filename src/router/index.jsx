import { lazy } from "react";
import { createBrowserRouter } from "react-router";








import {
  ProtectedRoute,
  PublicRoute,
  AdminRoute,
} from "../components/ProtectedRoute";




// Route-based lazy loading
const LoginPage = lazy(() => import("../pages/Login"));
const RegisterPage = lazy(() => import("../pages/Register"));
const HomePage = lazy(() => import("../pages/Home"));
const MyListPage = lazy(() => import("../pages/MyList"));
const SeriesPage = lazy(() => import("../pages/Series"));
const MoviesPage = lazy(() => import("../pages/Movies"));
const ProfilePage = lazy(() => import("../pages/Profile"));
const WatchMoviePage = lazy(() => import("../pages/WatchMovie"));
const SubscriptionPage = lazy(() => import("../pages/Subscription"));
const PaymentPage = lazy(() => import("../pages/Payment"));
const EditMovieSeries = lazy(() => import("../pages/Admin"));

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
        path: "/payment",
        Component: PaymentPage,
      },
      {
        path: "/watch/:id",
        Component: WatchMoviePage,
      },
    ],
  },

  // Halaman khusus Admin
  {
    Component: AdminRoute,
    children: [
      {
        path: "/edit_movie_series",
        Component: EditMovieSeries,
      },
    ],
  },
]);
