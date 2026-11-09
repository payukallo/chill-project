export interface ISubscriptionPlan {
  id: string;
  name: string;
  price: number;
  account: string;
  quality: string;
  features: string[];
}

export const subscriptionPlans: ISubscriptionPlan[] = [
  {
    id: "individual",
    name: "Individual",
    price: 49990,
    account: "1 Akun",
    quality: "720p",
    features: ["Tidak ada iklan", "Kualitas 720p", "Download konten pilihan"],
  },
  {
    id: "berdua",
    name: "Berdua",
    price: 79990,
    account: "2 Akun",
    quality: "1080p",
    features: ["Tidak ada iklan", "Kualitas 1080p", "Download konten pilihan"],
  },
  {
    id: "keluarga",
    name: "Keluarga",
    price: 159990,
    account: "5-7 Akun",
    quality: "4K",
    features: ["Tidak ada iklan", "Kualitas 4K", "Download konten pilihan"],
  },
];

export const formatRupiah = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
};
