import "../assets/styles/register.css";
import { useNavigate } from "react-router";
import type { FormEvent } from "react";
import { api } from "../components/utils/axiosApi";
import { Logo } from "../login-regis/Logo";
import { Title } from "../login-regis/Title";
import { Password } from "../login-regis/Password";
import { UserName } from "../login-regis/UserName";
import { Email } from "../login-regis/Email";
import { LoginRegisBtn } from "../login-regis/LoginRegisBtn";
import { HasAccount } from "../login-regis/HasAccount";

interface IRegisterResponse {
  message: string;
  userId: number;
}

export default function RegisterPage() {
  const navigate = useNavigate();

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const username = String(formData.get("username") ?? "")
      .trim()
      .toLowerCase();

    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();

    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!username || !email || !password || !confirmPassword) {
      alert("Semua kolom wajib diisi!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Konfirmasi kata sandi tidak cocok!");
      return;
    }

    if (username.length < 3 || username.length > 50) {
      alert("Username harus terdiri dari 3-50 karakter!");
      return;
    }

    if (password.length < 8 || password.length > 72) {
      alert("Kata sandi harus terdiri dari 8-72 karakter!");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      alert("Kata sandi harus memiliki minimal 1 huruf besar!");
      return;
    }

    if (!/[a-z]/.test(password)) {
      alert("Kata sandi harus memiliki minimal 1 huruf kecil!");
      return;
    }

    if (!/[0-9]/.test(password)) {
      alert("Kata sandi harus memiliki minimal 1 angka!");
      return;
    }

    if (!/[^A-Za-z0-9\s]/.test(password)) {
      alert(
        "Kata sandi harus memiliki minimal 1 simbol, seperti @, #, !, atau $!",
      );
      return;
    }

    try {
      const response = await api.post<IRegisterResponse>("/users/register", {
        username,
        email,
        password,
      });

      alert(response.data.message);
      navigate("/login");
    } catch (error: unknown) {
      console.error("Registrasi gagal:", error);

      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };

        alert(
          axiosError.response?.data?.message ??
            "Terjadi kesalahan saat registrasi.",
        );
      } else {
        alert("Terjadi kesalahan saat registrasi.");
      }
    }
  }

  return (
    <main className="register-page">
      <form className="register-container" onSubmit={handleRegister}>
        <Logo />
        <Title title="Daftar" subTitle="Selamat datang!" />

        <UserName autoComplete="username" />
        <Email autoComplete="email" />

        <Password paraPassword="Kata Sandi" inputName="password" />

        <div className="password-container">
          <Password
            paraPassword="Konfirmasi Kata Sandi"
            inputName="confirmPassword"
          />
          <HasAccount />
        </div>

        <LoginRegisBtn upBtn="Daftar" downBtn="Daftar dengan Google" />
      </form>
    </main>
  );
}
