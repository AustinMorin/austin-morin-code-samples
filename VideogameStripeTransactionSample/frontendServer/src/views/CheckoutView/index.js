import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hook/useAuth";
import StripePaymentForm from "./StripePaymentForm";

const StripTransaction = (props) => {
  const { user } = useAuth();
  const location = useLocation()

  if (location.state === null) return <Navigate to="/dashboard" />;

  const { clientSecret } = location.state;

  return (
    <div className="container">
      <h2>Checkout</h2>
      <p>$5 / mo for Premium Membership</p>
      <StripePaymentForm
        user={user}
        clientSecret={clientSecret}
      />
    </div>
  );
};

export default StripTransaction;