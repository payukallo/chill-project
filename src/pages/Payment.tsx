import "../assets/styles/payment.css";
import { Navbar } from "../layouts/Navbar.js";
import { Footer } from "../layouts/Footer.js";
import { PaymentContainer } from "../components/PaymentContainer.js";

const PaymentPage = () => {
  return (
    <main className="payment-page">
      <Navbar />
      <PaymentContainer />
      <Footer />
    </main>
  );
};

export default PaymentPage;
