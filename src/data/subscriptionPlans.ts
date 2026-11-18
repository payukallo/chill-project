export interface ISubscriptionPlan {
  id: string;
  name: string;
  price: number;
  account: string;
  quality: string;
  features: string[];
}

export interface ISubscriptionPackageAPI {
  id: number;
  name: string;
  price: string;
  billing_interval: string;
  min_accounts: number;
  max_accounts: number;
  video_quality: string;
  ad_free: number;
  download_enabled: number;
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

export const mapSubscriptionPackage = (
  pkg: ISubscriptionPackageAPI,
): ISubscriptionPlan => {
  const account =
    pkg.min_accounts === pkg.max_accounts
      ? `${pkg.max_accounts} Akun`
      : `${pkg.min_accounts}-${pkg.max_accounts} Akun`;

  const features: string[] = [];

  if (pkg.ad_free === 1) {
    features.push("Tidak ada iklan");
  }

  features.push(`Kualitas ${pkg.video_quality}`);

  if (pkg.download_enabled === 1) {
    features.push("Download konten pilihan");
  }

  return {
    id: pkg.name.toLowerCase(),
    name: pkg.name,
    price: Number(pkg.price),
    account,
    quality: pkg.video_quality,
    features,
  };
};

export const fetchSubscriptionPlans = async (): Promise<
  ISubscriptionPlan[]
> => {
  const response = await fetch(
    "http://localhost:5000/api/subscriptions/packages",
  );

  if (!response.ok) {
    throw new Error("Gagal mengambil paket langganan");
  }

  const result: {
    message: string;
    data: ISubscriptionPackageAPI[];
  } = await response.json();

  return result.data.map(mapSubscriptionPackage);
};
