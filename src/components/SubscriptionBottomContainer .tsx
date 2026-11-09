import CheckImg from "../assets/logo/check.png";
import { useNavigate } from "react-router";
import { subscriptionPlans, formatRupiah } from "../data/subscriptionPlans";

export function SubscriptionBottomContainer() {
  const navigate = useNavigate();

  const handleSubscribe = (planId: string) => {
    const selectedPlan = subscriptionPlans.find((plan) => plan.id === planId);

    if (!selectedPlan) return;

    navigate("/payment", {
      state: {
        plan: selectedPlan,
      },
    });
  };

  return (
    <div className="subscription-bottom">
      <div className="subscription-bottom-title">
        <span className="heading-3">Pilih Paketmu</span>
        <span className="body-medium-regular">
          Temukan paket sesuai kebutuhanmu!
        </span>
      </div>

      <div className="subscription-bottom-container">
        {subscriptionPlans.map((plan) => (
          <div className="subscription-bottom-box" key={plan.id}>
            <div className="subscription-bottom-box-up">
              <button className="body-large-semiBold">{plan.name}</button>

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
                onClick={() => handleSubscribe(plan.id)}
              >
                Langganan
              </button>

              <span className="caption-1-regular">
                Syarat dan Ketentuan Berlaku
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
