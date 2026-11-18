import CheckImg from "../assets/logo/check.png";
import { subscriptionPlans, formatRupiah } from "../data/subscriptionPlans";

interface ISubscriptionBottomContainerProps {
  alreadySubscribed: boolean;
  pendingSubscription: boolean;
  checkingSubscription: boolean;
  subscriptionError: boolean;
  onSubscribe: (planId: string) => void;
}

export function SubscriptionBottomContainer({
  alreadySubscribed,
  pendingSubscription,
  checkingSubscription,
  subscriptionError,
  onSubscribe,
}: ISubscriptionBottomContainerProps) {
  return (
    <div className="subscription-bottom">
      <div className="subscription-bottom-title">
        <span className="heading-3">Pilih Paketmu</span>

        <span className="body-medium-regular">
          Temukan paket sesuai kebutuhanmu!
        </span>
      </div>

      {subscriptionError && (
        <p role="alert">
          Status langganan belum dapat diperiksa. Coba muat ulang halaman.
        </p>
      )}

      <div className="subscription-bottom-container">
        {subscriptionPlans.map((plan) => {
          const isIndividual = plan.id === "individual";

          const buttonDisabled =
            isIndividual &&
            (alreadySubscribed || checkingSubscription || subscriptionError);

          const buttonText =
            isIndividual && checkingSubscription
              ? "Memeriksa..."
              : isIndividual && alreadySubscribed
                ? "Sudah Berlangganan"
                : isIndividual && pendingSubscription
                  ? "Lanjutkan Pembayaran"
                  : "Langganan";

          return (
            <div className="subscription-bottom-box" key={plan.id}>
              <div className="subscription-bottom-box-up">
                <button className="body-large-semiBold" type="button">
                  {plan.name}
                </button>

                <span className="body-small-regular">
                  Mulai dari {formatRupiah(plan.price)}/bulan {plan.account}
                </span>

                <div className="body-small-regular">
                  {plan.features.map((feature) => (
                    <div key={feature}>
                      <img src={CheckImg} alt="" />
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              <span className="line"></span>

              <div className="subscription-bottom-box-down">
                <button
                  className="body-medium-bold"
                  type="button"
                  disabled={buttonDisabled}
                  onClick={() => onSubscribe(plan.id)}
                >
                  {buttonText}
                </button>

                <span className="caption-1-regular">
                  Syarat dan Ketentuan Berlaku
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
