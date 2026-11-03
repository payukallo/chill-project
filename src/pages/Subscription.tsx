import "../assets/styles/subscription.css";
import { Navbar } from "../layouts/Navbar.js";
import { Footer } from "../layouts/Footer.js";
import { SubscriptionTopContainer } from "../components/SubscriptionTopContainer.js";
import { SubscriptionBottomContainer } from "../components/SubscriptionBottomContainer .js";

const SubscriptionPage = () => {
  return (
    <main className="subscription-page">
      <Navbar />
      <SubscriptionTopContainer />
      <SubscriptionBottomContainer/>
      <Footer />
    </main>
  );
};

export default SubscriptionPage;
