import { Navigate, Outlet } from "react-router";

export function ProtectedRoute() {
  const isLogin = localStorage.getItem("isLogin");

  if (isLogin !== "true") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function logoutUser() {
  localStorage.removeItem("isLogin");
  localStorage.removeItem("username");

  window.location.href = "/login";
}