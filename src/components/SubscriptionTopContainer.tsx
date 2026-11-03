import ImgBox1 from "../assets/logo/download.png";
import ImgBox2 from "../assets/logo/no-ads.png";
import ImgBox3 from "../assets/logo/all-content.png";
import ImgBox4 from "../assets/logo/4k.png";
import ImgBox5 from "../assets/logo/all-screen.png";
import ImgBox6 from "../assets/logo/subtitle.png";

export function SubscriptionTopContainer() {
  return (
    <div className="subscription-top">
      <span className="heading-3">Kenapa Harus Berlangganan?</span>
      <div className="subscription-top-content">
        <div className="subscription-top-box">
          <img src={ImgBox1} alt="" />
          <p className="heading-5">Download Konten Pilihan</p>
        </div>
        <div className="subscription-top-box">
          <img src={ImgBox2} alt="" />
          <p className="heading-5">Tidak Ada Iklan</p>
        </div>
        <div className="subscription-top-box">
          <img src={ImgBox3} alt="" />
          <p className="heading-5">Tonton Semua Konten</p>
        </div>
        <div className="subscription-top-box">
          <img src={ImgBox4} alt="" />
          <p className="heading-5">Kualitas Maksimal Sampai Dengan 4K</p>
        </div>
        <div className="subscription-top-box">
          <img src={ImgBox5} alt="" />
          <p className="heading-5">Tonton di Tv, Tablet, Mobile, dan Laptop</p>
        </div>
        <div className="subscription-top-box">
          <img src={ImgBox6} alt="" />
          <p className="heading-5">Subtitle Untuk Konten Pilihan</p>
        </div>
      </div>
    </div>
  );
}
