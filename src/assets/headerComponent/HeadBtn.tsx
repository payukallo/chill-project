import LogoInfo from "../logo/!.png";
import LogoVolume from "../logo/mute-volume.png";

export function HeadBtn() {
  return (
    <div className="head-btn">
      <div className="btn-left">
        <button className="btn-primary-shadow">Mulai</button>
        <button className="btn-secondary-contained info">
          <img src={LogoInfo} alt="" />
          Selengkapnya
        </button>
        <span className="age body-large-regular">18+</span>
      </div>
      <button id="volume" >
        <img src={LogoVolume} alt="" />
      </button>
    </div>
  );
}
