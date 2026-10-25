import "../assets/styles/login.css";
import { Logo } from "../components/logo";
import { Title } from "../components/title";
import { UserName } from "../components/userName";
import { Password } from "../components/password";
import { NewAccount } from "../components/newAccount";
import { LoginRegisBtn } from "../components/loginRegisBtn";

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
