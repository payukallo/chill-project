import "../assets/styles/videoPlayer.css";
import "../assets/styles/premiumVideoPlayer.css";
import { useNavigate } from "react-router";

interface IPremiumVideoPlayer {
  bannerUrl: string;
  title: string;
  isSeries?: boolean;
}

const premiumBenefits = [
  {
    icon: "download",
    label: "Download Konten Pilihan",
  },
  {
    icon: "ads",
    label: "Tidak Ada Iklan",
  },
  {
    icon: "film",
    label: "Tonton Semua Konten",
  },
  {
    icon: "quality",
    label: "Kualitas Maksimal Sampai Dengan 4K",
  },
  {
    icon: "devices",
    label: "Tonton di TV, Tablet, Mobile, dan Laptop",
  },
  {
    icon: "subtitle",
    label: "Subtitle Untuk Konten Pilihan",
  },
];

const PremiumIcon = ({ name }: { name: string }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "download" && (
        <>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M4 16v5h16v-5" />
        </>
      )}

      {name === "ads" && (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M2 2l20 20" />
          <text
            x="12"
            y="14"
            fontSize="7"
            textAnchor="middle"
            fill="currentColor"
            stroke="none"
          >
            AD
          </text>
        </>
      )}

      {name === "film" && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4" />
          <path d="m10 9 5 3-5 3z" />
        </>
      )}

      {name === "quality" && (
        <>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <text
            x="12"
            y="15"
            fontSize="9"
            textAnchor="middle"
            fill="currentColor"
            stroke="none"
          >
            4K
          </text>
        </>
      )}

      {name === "devices" && (
        <>
          <rect x="2" y="3" width="16" height="13" rx="1" />
          <path d="M10 16v5M6 21h8" />
          <rect x="16" y="10" width="6" height="11" rx="1" />
        </>
      )}

      {name === "subtitle" && (
        <>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M5 12h5M14 12h5M5 16h8M16 16h3" />
        </>
      )}
    </svg>
  );
};

export default function PremiumVideoPlayer({
  bannerUrl,
  title,
  isSeries = false,
}: IPremiumVideoPlayer) {
  const navigate = useNavigate();

  return (
    <div className="video-player premium-video-player">
      {/* Background pengganti video */}
      <div className="premium-player-screen">
        <img src={bannerUrl} alt="" className="premium-player-background" />

        <div className="premium-player-overlay" />
      </div>

      {/* Popup Premium */}
      <div className="premium-player-content">
        <div className="premium-player-header">
          <h2>Layanan Premium ✨</h2>

          <p>Tingkatkan paket anda untuk dapat menonton video ini.</p>
        </div>

        {/* Keuntungan berlangganan */}
        <div className="premium-player-benefits">
          <h3>Kenapa Harus Berlangganan?</h3>

          <div className="premium-benefits-grid">
            {premiumBenefits.map((benefit) => (
              <div className="premium-benefit-item" key={benefit.icon}>
                <PremiumIcon name={benefit.icon} />

                <p>{benefit.label}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="premium-upgrade-button"
          onClick={() => navigate("/subscription")}
        >
          Ubah Jadi Premium
        </button>
      </div>

      {/* Kontrol video dalam kondisi terkunci */}
      <div className="video-controls premium-locked-controls">
        <div className="video-control-content">
          <div className="video-control-left">
            <button type="button" disabled>
              ▶
            </button>

            <button type="button" disabled>
              ↶ 10
            </button>

            <button type="button" disabled>
              10 ↷
            </button>

            <button type="button" disabled>
              🔊
            </button>
          </div>

          <div className="video-control-center">
            <span className="body-large-semiBold">{title}</span>
          </div>

          <div className="video-control-right">
            {isSeries && (
              <button type="button" disabled>
                ☷
              </button>
            )}

            <button type="button" disabled>
              ⓘ
            </button>

            <select disabled aria-label="Kecepatan video" defaultValue="1">
              <option value="1">1x</option>
            </select>

            <button type="button" disabled>
              ⛶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
