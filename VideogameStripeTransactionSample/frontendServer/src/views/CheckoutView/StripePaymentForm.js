import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Error from "../../components/Error";
import Button from "react-bootstrap/Button";
import useIsMountedRef from "../../hook/useIsMountedRef";

// call `loadStripe` outside of a component’s render
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ user, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  // query manager
  const queryClient = useQueryClient();

  // loading states
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useIsMountedRef();

  // update loading states
  useEffect(() => {
    setTimeout(() => {
      if (isMountedRef.current) setIsLoading(false);
    }, 2000);
  }, []);

  // first stripe payment
  const firstStripePayment = async () => {
    const token = await user.getIdToken();
    const res = await fetch(
      process.env.REACT_APP_SERVER_URL + `/subscription/stripe/firstpay`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    return data.result;
  };

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    // Stripe.js has not loaded yet. Make sure to disable
    // form submission until Stripe.js has loaded.
    if (!stripe || !elements) return;

    try {
      // loading effect
      setIsLoading(true);

      // quick first payment
      await firstStripePayment();

      // invalidate subscription
      queryClient.invalidateQueries("getSubscription");

      // reset get subscription
      const { err } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: process.env.REACT_APP_URL + "/dashboard",
        },
      });

      if (err) {
        throw err;
      }
    } catch (err) {
      // loading effect
      setIsLoading(false);

      // error state
      setError(err.message);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <Error error={error} />}
      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Check Out"}
      </Button>
    </form>
  );
};

const StripePaymentForm = ({ user, clientSecret }) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: clientSecret,
      }}
    >
      <CheckoutForm user={user} clientSecret={clientSecret} />
    </Elements>
  );
};

export default StripePaymentForm;