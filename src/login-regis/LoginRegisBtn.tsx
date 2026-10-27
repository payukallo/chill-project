import GoogleLogo from "../assets/logo/google.png";

interface ILoginRegisBtn {
  upBtn: string;
  downBtn: string;
}

export function LoginRegisBtn(props: ILoginRegisBtn) {
  const { upBtn, downBtn } = props;
  return (
    <div className="login-regis-btn">
      <button className="body-medium-semiBold log" type="submit">
        {upBtn}
      </button>
      <span className="body-small-medium">Atau</span>
      <button className="google-login body-medium-semiBold">
        <img src={GoogleLogo} width={18} />
        {downBtn}
      </button>
    </div>
  );
}
