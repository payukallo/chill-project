import { Navigate, Outlet } from "react-router";

// Melindungi halaman yang membutuhkan login
export function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// Melindungi halaman khusus admin
export function AdminRoute() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

// Mencegah pengguna yang sudah login membuka Login dan Register
export function PublicRoute() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

// Fungsi logout
export async function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/login";
}
