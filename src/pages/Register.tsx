import "../assets/styles/register.css";
import { Logo } from "../login-regis/Logo";
import { Title } from "../components/Title";
import { UserName } from "../login-regis/UserName";
import { Password } from "../login-regis/Password";
import { HasAccount } from "../login-regis/HasAccount";
import { LoginRegisBtn } from "../login-regis/LoginRegisBtn";

const RegisterPage = () => {
  return (
    <>
      <main className="register-page">
        <form action="" method="post">
          <div className="register-container">
            <Logo />
            <Title title={"Daftar"} subTitle={"Selamat datang!"} />
            <UserName />
            <Password paraPassword={"Kata Sandi"} />
            <div className="password-container">
              <Password paraPassword={"Konfirmasi Kata Sandi"} />
              <HasAccount />
            </div>
            <LoginRegisBtn upBtn={"Daftar"} downBtn={"Daftar dengan Google"} />
          </div>
        </form>
      </main>
    </>
  );
};

export default RegisterPage;
