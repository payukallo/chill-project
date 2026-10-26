import "../assets/styles/login.css";
import { Logo } from "../login-regis/Logo";
import { Title } from "../components/Title";
import { UserName } from "../login-regis/UserName";
import { Password } from "../login-regis/Password";
import { NewAccount } from "../login-regis/NewAccount";
import { LoginRegisBtn } from "../login-regis/LoginRegisBtn";

const LoginPage = () => {
  return (
    <>
      <main className="login-page">
        <form action="" method="get">
          <div className="login-container">
            <Logo />
            <Title title={"Masuk"} subTitle={"Selamat datang kembali"} />
            <UserName />
            <div className="password-container">
              <Password paraPassword={"Kata Sandi"} />
              <NewAccount />
            </div>
            <LoginRegisBtn upBtn={"Masuk"} downBtn={"Masuk dengan Google"} />
          </div>
        </form>
      </main>
    </>
  );
};

// hello

export default LoginPage;
