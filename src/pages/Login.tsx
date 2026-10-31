import "../assets/styles/login.css";
import { Logo } from "../login-regis/Logo";
import { Title } from "../login-regis/Title";
import { UserName } from "../login-regis/UserName";
import { Password } from "../login-regis/Password";
import { NewAccount } from "../login-regis/NewAccount";
import { LoginRegisBtn } from "../login-regis/LoginRegisBtn";

import type React from "react";
import { useNavigate } from "react-router";
import { loginUser } from "../components/type/UsersApi";


const LoginPage = () => {
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      alert("Username dan password harus diisi!");
      return;
    }

    try {
      const user = await loginUser(username, password);

      localStorage.setItem("isLogin", "true");
      localStorage.setItem("username", user.username);

      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
      
    }  

    navigate("/");
  }

  return (
    <main className="login-page">
      <form onSubmit={handleLogin}>
        <div className="login-container">
          <Logo />
          <Title title={"Masuk"} subTitle={"Selamat datang kembali"} />
          <UserName autoComplete={"on"}/>
          <div className="password-container">
            <Password paraPassword={"Kata Sandi"} inputName="password" />
            <NewAccount />
          </div>
          <LoginRegisBtn upBtn={"Masuk"} downBtn={"Masuk dengan Google"} />
        </div>
      </form>
    </main>
  );
};

export default LoginPage;
