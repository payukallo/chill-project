import "../assets/styles/login.css";
import { useNavigate, Link } from "react-router";
import type { FormEvent } from "react";
import { supabase } from "../components/utils/supabase";
import { usernameToAuthEmail } from "../components/utils/authUsername";
import { Logo } from "../login-regis/Logo";
import { Title } from "../login-regis/Title";
import { UserName } from "../login-regis/UserName";
import { Password } from "../login-regis/Password";
import { LoginRegisBtn } from "../login-regis/LoginRegisBtn";
import { NewAccount } from "../login-regis/NewAccount";

export default function LoginPage() {
  const navigate = useNavigate();

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "")
      .trim()
      .toLowerCase();

    const password = String(formData.get("password") ?? "");

    if (!username || !password) {
      alert("Username dan kata sandi wajib diisi!");
      return;
    }

    try {
      // Mengubah username menjadi email internal
      const authEmail = usernameToAuthEmail(username);

      // Login menggunakan Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password,
      });

      if (error) throw error;

      if (!data.session) {
        throw new Error("Session login tidak ditemukan.");
      }

      alert("Login berhasil!");

      navigate("/");
    } catch (error) {
      console.error("Login gagal:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Username atau kata sandi salah.");
      }
    }
  }

  return (
    <main className="login-page">
      <form className="login-container" onSubmit={handleLogin}>
        <Logo />
        <Title title="Masuk" subTitle="Selamat datang kembali!" />
        <UserName autoComplete="username" />
        <div className="password-container">
          <Password paraPassword="Kata Sandi" inputName="password" />
          <NewAccount />
        </div>
        <LoginRegisBtn upBtn="Masuk" downBtn="Masuk Dengan Google" />
      </form>
    </main>
  );
}
