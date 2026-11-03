import "../assets/styles/register.css";
import { useNavigate } from "react-router";
import type { FormEvent } from "react";
import { supabase } from "../components/utils/supabase";
import { usernameToAuthEmail } from "../components/utils/authUsername";
import { Logo } from "../login-regis/Logo";
import { Title } from "../login-regis/Title";
import { Password } from "../login-regis/Password";
import { UserName } from "../login-regis/UserName";
import { LoginRegisBtn } from "../login-regis/LoginRegisBtn";
import { HasAccount } from "../login-regis/HasAccount";

export default function RegisterPage() {
  const navigate = useNavigate();

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "")
      .trim()
      .toLowerCase();

    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    // Validasi password
    if (!username || !password || !confirmPassword) {
      alert("Semua kolom wajib diisi!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Konfirmasi kata sandi tidak cocok!");
      return;
    }

    if (password.length < 8) {
      alert("Kata sandi minimal 8 karakter!");
      return;
    }

    try {
      // Mengubah username menjadi email internal
      const authEmail = usernameToAuthEmail(username);

      // Registrasi Supabase
      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error("Registrasi gagal. Silakan coba kembali.");
      }

      alert("Registrasi berhasil!");

      // Jika session tersedia, langsung masuk ke halaman utama
      if (data.session) {
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Registrasi gagal:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan saat registrasi.");
      }
    }
  }

  return (
    <main className="register-page">
      <form className="register-container" onSubmit={handleRegister}>
        <Logo />
        <Title title={"Daftar"} subTitle={"Selamat datang!"} />
        <UserName autoComplete={"username"} />
        <Password paraPassword={"Kata Sandi"} inputName="password" />
        <div className="password-container">
          <Password
            paraPassword={"Konfirmasi Kata Sandi"}
            inputName="confirmPassword"
          />
          <HasAccount />
        </div>
        <LoginRegisBtn upBtn={"Daftar"} downBtn={"Daftar dengan Google"} />
      </form>
    </main>
  );
}
