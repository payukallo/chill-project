
import type { FormEvent } from "react";
import "../assets/styles/register.css";
import { Logo } from "../login-regis/Logo";
import { Title } from "../login-regis/Title";
import { UserName } from "../login-regis/UserName";
import { Password } from "../login-regis/Password";
import { HasAccount } from "../login-regis/HasAccount";
import { LoginRegisBtn } from "../login-regis/LoginRegisBtn";
import { checkUsername, createUser } from "../components/type/UsersApi";

const RegisterPage = () => {
  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = (formData.get("username") as string).trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!username) {
      alert("Username tidak boleh kosong!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }

    try {
      // 1. Periksa username terlebih dahulu
      const isUsernameTaken = await checkUsername(username);

      // 2. Jika sudah digunakan, hentikan proses
      if (isUsernameTaken) {
        alert("Username sudah terdaftar!");
        return;
      }

      // 3. Jika belum digunakan, buat user baru
      const newUser = await createUser({
        username,
        password,
      });

      console.log("User berhasil dibuat:", newUser);
      alert("Registrasi berhasil!");
    } catch (error) {
      console.error(error);
      alert("Registrasi gagal!");
    }
  }

  return (
    <main className="register-page">
      <form onSubmit={handleRegister}>
        <div className="register-container">
          <Logo />
          <Title title={"Daftar"} subTitle={"Selamat datang!"} />
          <UserName autoComplete={"off"}/>
          <Password
            paraPassword={"Kata Sandi"}
            inputName="password"
          />
          <div className="password-container">
            <Password
              paraPassword={"Konfirmasi Kata Sandi"}
              inputName="confirmPassword"
            />
            <HasAccount />
          </div>
          <LoginRegisBtn
            upBtn={"Daftar"}
            downBtn={"Daftar dengan Google"}
          />
        </div>
      </form>
    </main>
  );
};

export default RegisterPage;
