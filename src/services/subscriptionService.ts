import { api } from "../components/utils/axiosApi";

export interface IUserSubscription {
  id: number;
  user_id: number;
  package_id: number;
  package_name: string;
  price: string;
  billing_interval: string;
  video_quality: string;
  start_date: string;
  end_date: string;
  status: "pending" | "active" | "expired" | "cancelled";
}

interface ISubscriptionResponse {
  message: string;
  data: IUserSubscription | null;
}

// Mengambil langganan pengguna yang sedang login
export const getMySubscription = async () => {
  const response = await api.get<ISubscriptionResponse>("/subscriptions/me");

  return response.data.data;
};

// Membuat langganan baru dengan status pending
export const createSubscription = async (packageId: number) => {
  const response = await api.post<{
    message: string;
    data: {
      subscriptionId: number;
      status: "pending";
    };
  }>("/subscriptions", { packageId });

  return response.data.data;
};

// Menjalankan simulasi pembayaran
export const simulateSubscriptionPayment = async (subscriptionId: number) => {
  const response = await api.post<{
    message: string;
    data: {
      subscriptionId: number;
      status: "active";
    };
  }>("/subscriptions/simulate-payment", {
    subscriptionId,
  });

  return response.data.data;
};

export const isSubscriptionActive = (
  subscription: IUserSubscription | null,
): boolean => {
  if (!subscription) return false;

  if (subscription.status !== "active") {
    return false;
  }

  const now = Date.now();
  const startDate = new Date(subscription.start_date).getTime();
  const endDate = new Date(subscription.end_date).getTime();

  return (
    Number.isFinite(startDate) &&
    Number.isFinite(endDate) &&
    startDate <= now &&
    endDate > now
  );
};
