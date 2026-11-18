import "../assets/styles/subscription.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../layouts/Navbar.js";
import { Footer } from "../layouts/Footer.js";
import { SubscriptionTopContainer } from "../components/SubscriptionTopContainer.js";
import { SubscriptionBottomContainer } from "../components/SubscriptionBottomContainer .js";
import { subscriptionPlans } from "../data/subscriptionPlans";

import {
  getMySubscription,
  isSubscriptionActive,
} from "../services/subscriptionService";

const SubscriptionPage = () => {
  const navigate = useNavigate();

  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [pendingSubscription, setPendingSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkSubscription = async () => {
      try {
        const subscription = await getMySubscription();

        if (cancelled) return;

        setAlreadySubscribed(isSubscriptionActive(subscription));
        setPendingSubscription(subscription?.status === "pending");
      } catch (error) {
        console.error("Gagal memeriksa langganan:", error);

        if (!cancelled) {
          setSubscriptionError(true);
        }
      } finally {
        if (!cancelled) {
          setCheckingSubscription(false);
        }
      }
    };

    checkSubscription();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubscribe = (planId: string) => {
    if (
      planId === "individual" &&
      (alreadySubscribed ||
        pendingSubscription ||
        checkingSubscription ||
        subscriptionError)
    ) {
      return;
    }

    const selectedPlan = subscriptionPlans.find((plan) => plan.id === planId);

    if (!selectedPlan) return;

    navigate("/payment", {
      state: {
        plan: selectedPlan,
      },
    });
  };

  return (
    <main className="subscription-page">
      <Navbar />

      <SubscriptionTopContainer />

      <SubscriptionBottomContainer
        alreadySubscribed={alreadySubscribed}
        pendingSubscription={pendingSubscription}
        checkingSubscription={checkingSubscription}
        subscriptionError={subscriptionError}
        onSubscribe={handleSubscribe}
      />

      <Footer />
    </main>
  );
};

export default SubscriptionPage;
