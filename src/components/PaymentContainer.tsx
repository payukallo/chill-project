import { formatRupiah } from "../data/subscriptionPlans";
import type { ISubscriptionPlan } from "../data/subscriptionPlans";
import CheckImg from "../assets/logo/check.png";
import Visa from "../assets/logo/visa.png";
import MasterCard from "../assets/logo/master-card.png";
import JCBCard from "../assets/logo/JCB-card.png";
import AmericanExpress from "../assets/logo/american-express.png";
import BCACard from "../assets/logo/BCA.png";

const ADMIN_FEE = 3000;

interface IPaymentContainerProps {
  selectedPlan: ISubscriptionPlan;
  loading: boolean;
  message: string;
  paymentSuccess: boolean;
  alreadySubscribed: boolean;
  onPayment: () => void;
}

export function PaymentContainer({
  selectedPlan,
  loading,
  message,
  paymentSuccess,
  alreadySubscribed,
  onPayment,
}: IPaymentContainerProps) {
  const isIndividual = selectedPlan.id === "individual";
  const totalPayment = selectedPlan.price + ADMIN_FEE;
  const buttonDisabled =
    !isIndividual || loading || paymentSuccess || alreadySubscribed;

  const buttonText = alreadySubscribed
    ? "Sudah Berlangganan"
    : paymentSuccess
      ? "Pembayaran Berhasil"
      : loading
        ? "Memproses..."
        : isIndividual
          ? "Bayar"
          : "Pembayaran Belum Tersedia";

  return (
    <div className="payment-container">
      <span className="heading-3">Ringkasan Pembayaran</span>

      <div className="payment">
        {/* Paket yang dipilih */}
        <div className="subscription-bottom-box subscription-payment">
          <div className="subscription-bottom-box-up">
            <button className="body-large-semiBold" type="button">
              {selectedPlan.name}
            </button>

            <span className="body-small-regular">
              Mulai dari {formatRupiah(selectedPlan.price)}/bulan{" "}
              {selectedPlan.account}
            </span>

            <div className="body-small-regular">
              {selectedPlan.features.map((feature) => (
                <div key={feature}>
                  <img src={CheckImg} alt="" />
                  <p>{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <span className="line"></span>

          <div className="subscription-bottom-box-down">
            <button className="body-medium-bold" type="button">
              Langganan
            </button>

            <span className="caption-1-regular">
              Syarat dan Ketentuan Berlaku
            </span>
          </div>
        </div>

        {/* Informasi pembayaran */}
        <div className="payment-box">
          <div className="payment-method-box">
            <span className="body-large-semiBold">Metode Pembayaran</span>

            <form className="body-medium-regular payment-method">
              <label>
                <input type="radio" name="choice" value="card" />
                <img src={Visa} alt="Visa" />
                <img src={MasterCard} alt="MasterCard" />
                <img src={JCBCard} alt="JCB" />
                <img src={AmericanExpress} alt="American Express" />
                Kartu Debit/Kredit
              </label>

              <label>
                <input type="radio" name="choice" value="bca" />
                <img src={BCACard} alt="BCA" id="bca" />
                BCA Virtual Account
              </label>
            </form>
          </div>

          {/* Voucher */}
          <div className="voucher-box">
            <span className="body-large-semiBold">Kode Voucher (Jika ada)</span>

            <label className="voucher" htmlFor="voucher">
              <input
                id="voucher"
                type="text"
                placeholder="Masukkan kode voucher"
              />

              <button type="button" className="body-medium-bold">
                Gunakan
              </button>
            </label>
          </div>

          {/* Ringkasan transaksi */}
          <div className="transaction">
            <span className="body-large-semiBold">Ringkasan Transaksi</span>

            <div className="transaction-box body-medium-regular">
              <div>
                <span>Paket Premium {selectedPlan.name}</span>
                <span className="money">
                  {formatRupiah(selectedPlan.price)}
                </span>
              </div>

              <div>
                <span>Biaya Admin</span>
                <span className="money">{formatRupiah(ADMIN_FEE)}</span>
              </div>

              <div id="total-payment">
                <span>Total Pembayaran</span>
                <span className="money">{formatRupiah(totalPayment)}</span>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="body-medium-bold"
                disabled={buttonDisabled}
                onClick={onPayment}
              >
                {buttonText}
              </button>

              {message && (
                <p className="body-small-regular" role="status">
                  {message}
                </p>
              )}

              {!isIndividual && (
                <p className="body-small-regular">
                  Pembayaran paket {selectedPlan.name} belum tersedia. Untuk
                  sementara, hanya paket Individual yang dapat diproses.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
