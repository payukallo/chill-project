import "../assets/styles/register.css";
import { Logo } from "../components/logo";
import { Title } from "../components/title";
import { UserName } from "../components/userName";
import { Password } from "../components/password";
import { HasAccount } from "../components/hasAccount";
import { LoginRegisBtn } from "../components/loginRegisBtn";

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
