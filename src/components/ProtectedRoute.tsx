import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { supabase } from "./utils/supabase";

// Melindungi halaman yang membutuhkan login
export function ProtectedRoute() {
  const [isLogin, setIsLogin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        setIsLogin(false);
        return;
      }

      setIsLogin(!!data.session);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLogin(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLogin === null) return <p>Memeriksa autentikasi...</p>;

  if (!isLogin) return <Navigate to="/login" replace />;

  return <Outlet />;
}

// Fungsi logout
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Gagal logout:", error);
    alert("Gagal keluar dari akun!");
    return;
  }

  localStorage.removeItem("isLogin");
  localStorage.removeItem("username");

  window.location.href = "/login";
}
