import "../assets/styles/payment.css";
import { useEffect, useRef, useState } from "react";
import { useLocation, Navigate } from "react-router";
import { Navbar } from "../layouts/Navbar.js";
import { Footer } from "../layouts/Footer.js";
import { PaymentContainer } from "../components/PaymentContainer.js";
import type { ISubscriptionPlan } from "../data/subscriptionPlans";

import {
  getMySubscription,
  isSubscriptionActive,
  createSubscription,
  simulateSubscriptionPayment,
} from "../services/subscriptionService";

interface IPaymentLocationState {
  plan: ISubscriptionPlan;
}

const PaymentPage = () => {
  const location = useLocation();
  const state = location.state as IPaymentLocationState | null;
  const selectedPlan = state?.plan;
  const paymentInProgressRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [message, setMessage] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  const isIndividual = selectedPlan?.id === "individual";

  // Memeriksa status langganan ketika halaman dibuka
  useEffect(() => {
    if (!isIndividual) {
      setCheckingSubscription(false);
      return;
    }

    let cancelled = false;

    const checkSubscription = async () => {
      try {
        const subscription = await getMySubscription();

        if (cancelled) return;

        if (isSubscriptionActive(subscription)) {
          setAlreadySubscribed(true);
          setMessage("Kamu sudah memiliki langganan aktif.");
        } else if (subscription?.status === "pending") {
          setMessage("Kamu memiliki langganan yang menunggu pembayaran.");
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Gagal memeriksa langganan:", error);
          setMessage("Gagal memeriksa status langganan.");
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
  }, [isIndividual]);

  const handlePayment = async () => {
    if (
      !isIndividual ||
      paymentInProgressRef.current ||
      loading ||
      checkingSubscription ||
      alreadySubscribed ||
      paymentSuccess
    ) {
      return;
    }

    paymentInProgressRef.current = true;
    setLoading(true);
    setMessage("");

    try {
      const subscription = await getMySubscription();

      if (isSubscriptionActive(subscription)) {
        setAlreadySubscribed(true);
        setMessage("Kamu sudah memiliki langganan aktif.");
        return;
      }

      let subscriptionId: number;

      if (subscription?.status === "pending") {
        if (subscription.package_id !== 1) {
          setMessage("Paket langganan tidak dapat diproses.");
          return;
        }

        subscriptionId = subscription.id;
      } else {
        const created = await createSubscription(1);
        subscriptionId = created.subscriptionId;
      }

      const payment = await simulateSubscriptionPayment(subscriptionId);

      if (payment.status === "active") {
        setPaymentSuccess(true);
        setMessage(
          "Simulasi pembayaran berhasil! Paket Individual sekarang aktif.",
        );
      }
    } catch (error) {
      console.error("Gagal memproses pembayaran:", error);

      setMessage(
        "Pembayaran belum berhasil diproses. Silakan periksa status langganan sebelum mencoba lagi.",
      );
    } finally {
      paymentInProgressRef.current = false;
      setLoading(false);
    }
  };

  // Redirect jika halaman Payment dibuka tanpa memilih paket
  if (!selectedPlan) {
    return <Navigate to="/subscription" replace />;
  }

  return (
    <main className="payment-page">
      <Navbar />
      <PaymentContainer
        selectedPlan={selectedPlan}
        loading={loading || checkingSubscription}
        message={message}
        paymentSuccess={paymentSuccess}
        alreadySubscribed={alreadySubscribed}
        onPayment={handlePayment}
      />
      <Footer />
    </main>
  );
};

export default PaymentPage;
