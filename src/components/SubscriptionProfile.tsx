import { NavLink } from "react-router";
import WarningImg from "../assets/logo/warning-icon.png";
import type { IUserSubscription } from "../services/subscriptionService";
import { isSubscriptionActive } from "../services/subscriptionService";

interface ISubscriptionContainerProfile {
  subscription: IUserSubscription | null;
  subscriptionLoading: boolean;
  subscriptionError: boolean;
}

export function SubscriptionContainerProfile({
  subscription,
  subscriptionLoading,
  subscriptionError,
}: ISubscriptionContainerProfile) {
  const isPremiumActive = isSubscriptionActive(subscription);

  const subscriptionEndDate = subscription
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(subscription.end_date))
    : "";

  return (
    <div className="subscription">
      {subscriptionLoading ? (
        <div className="subscription-box">
          <p>Memeriksa status langganan...</p>
        </div>
      ) : subscriptionError ? (
        <div className="subscription-box">
          <p>Gagal memuat status langganan. Coba muat ulang halaman.</p>
        </div>
      ) : isPremiumActive && subscription ? (
        <div className="subscription-box premium-card">
          <span className="subscription-premium-badge body-medium-bold">
            Aktif
          </span>

          <div>
            <p className="heading-4">
              Akun Premium {subscription.package_name}✨
            </p>

            <p className="body-large-regular">
              Saat ini kamu sedang menggunakan akses akun premium
            </p>
          </div>

          <p className="body-medium-medium">
            Berlaku hingga {subscriptionEndDate}
          </p>
        </div>
      ) : (
        <div className="subscription-box">
          <div>
            <img src={WarningImg} alt="" id="subscription-img" />

            <div className="des-text">
              <span className="heading-4 span-subscription"></span>

              <p className="body-large-regular">
                Dapatkan Akses Tak Terbatas ke Ribuan Film dan Series Kesukaan
                Kamu!
              </p>
            </div>
          </div>

          <div className="navlink">
            <NavLink to="/subscription" className="body-medium-bold">
              {subscription?.status === "pending"
                ? "Lanjutkan Pembayaran"
                : "Mulai Berlangganan"}
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}
