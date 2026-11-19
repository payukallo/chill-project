import "../assets/styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { FormEvent } from "react";
import { api } from "../components/utils/axiosApi";
import { Logo } from "../login-regis/Logo";
import { Title } from "../login-regis/Title";
import { UserName } from "../login-regis/UserName";
import { Password } from "../login-regis/Password";
import { LoginRegisBtn } from "../login-regis/LoginRegisBtn";
import { NewAccount } from "../login-regis/NewAccount";
import { useMyListStore } from "../stores/useMyListStore";

interface ILoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: "admin" | "user";
  };
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Mencegah submit berulang
    if (isLoading) return;

    const formData = new FormData(event.currentTarget);

    const username = String(formData.get("username") ?? "")
      .trim()
      .toLowerCase();

    const password = String(formData.get("password") ?? "");

    if (!username || !password) {
      alert("Username dan kata sandi wajib diisi!");
      return;
    }

    // Aktifkan animasi loading
    setIsLoading(true);

    try {
      // Login melalui Express API
      const response = await api.post<ILoginResponse>("/users/login", {
        username,
        password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Respons login tidak valid.");
      }

      // Simpan autentikasi
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Ambil My List pengguna
      await useMyListStore.getState().fetchMyList();

      alert("Login berhasil!");

      // Arahkan ke Home
      navigate("/");
    } catch (error) {
      console.error("Login gagal:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Username atau kata sandi salah.");
      }
    } finally {
      // Matikan loading baik berhasil maupun gagal
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page">
      <form
        className="login-container"
        onSubmit={handleLogin}
        aria-busy={isLoading}
      >
        <Logo />

        <Title title="Masuk" subTitle="Selamat datang kembali!" />

        <UserName autoComplete="username" />

        <div className="password-container">
          <Password paraPassword="Kata Sandi" inputName="password" />

          <NewAccount />
        </div>

        <LoginRegisBtn upBtn="Masuk" downBtn="Masuk Dengan Google" />

        {/* Animasi loading */}
        {isLoading && (
          <div
            className="login-loading-overlay"
            role="status"
            aria-label="Sedang masuk"
          >
            <span className="login-spinner" aria-hidden="true" />
          </div>
        )}
      </form>
    </main>
  );
}
