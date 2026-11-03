import CheckImg from "../assets/logo/check.png";

export function SubscriptionBottomContainer() {
  return (
    <div className="subscription-bottom">
      <div className="subscription-bottom-title">
        <span className="heading-3">Pilih Paketmu</span>
        <span className="body-medium-regular">
          Temukan paket sesuai kebutuhanmu!
        </span>
      </div>
      <div className="subscription-bottom-container">
        <div className="subscription-bottom-box">
          <div className="subscription-bottom-box-up">
            <button className="body-large-semiBold">Individual</button>
            <span className="body-small-regular">
              Mulai dari Rp.49,990/bulan 1 Akun
            </span>
            <div className="body-small-regular">
              <div>
                <img src={CheckImg} alt="" />
                <p>Tidak ada iklan</p>
              </div>
              <div>
                <img src={CheckImg} alt="" />
                <p>Kualitas 720p</p>
              </div>
              <div>
                <img src={CheckImg} alt="" />
                <p>Download konten pilihan</p>
              </div>
            </div>
          </div>
          <span className="line"></span>
          <div className="subscription-bottom-box-down">
            <button className="body-medium-bold">Langganan</button>
            <span className="caption-1-regular">
              Syarat dan Ketentuan Berlaku
            </span>
          </div>
        </div>
        <div className="subscription-bottom-box">
          <div className="subscription-bottom-box-up">
            <button className="body-large-semiBold">Berdua</button>
            <span className="body-small-regular">
              Mulai dari Rp.79,990/bulan 2 Akun
            </span>
            <div className="body-small-regular">
              <div>
                <img src={CheckImg} alt="" />
                <p>Tidak ada iklan</p>
              </div>
              <div>
                <img src={CheckImg} alt="" />
                <p>Kualitas 1080p</p>
              </div>
              <div>
                <img src={CheckImg} alt="" />
                <p>Download konten pilihan</p>
              </div>
            </div>
          </div>
          <span className="line"></span>
          <div className="subscription-bottom-box-down">
            <button className="body-medium-bold">Langganan</button>
            <span className="caption-1-regular">
              Syarat dan Ketentuan Berlaku
            </span>
          </div>
        </div>
        <div className="subscription-bottom-box">
          <div className="subscription-bottom-box-up">
            <button className="body-large-semiBold">Keluarga</button>
            <span className="body-small-regular">
              Mulai dari Rp.159,990/bulan 5-7 Akun
            </span>
            <div className="body-small-regular">
              <div>
                <img src={CheckImg} alt="" />
                <p>Tidak ada iklan</p>
              </div>
              <div>
                <img src={CheckImg} alt="" />
                <p>Kualitas 4K</p>
              </div>
              <div>
                <img src={CheckImg} alt="" />
                <p>Download konten pilihan</p>
              </div>
            </div>
          </div>
          <span className="line"></span>
          <div className="subscription-bottom-box-down">
            <button className="body-medium-bold">Langganan</button>
            <span className="caption-1-regular">
              Syarat dan Ketentuan Berlaku
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
