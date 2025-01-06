import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const stripePromise = loadStripe(
  "pk_test_51QaI1LIeVDaGAabHH39EBEekcXfb4vu98NzXXadUlbC51nEDM8JDoRTaaCtoPoEZR0TxNeuhz1EbqR4178UL1Rgn00cHETgarJ"
);

const CheckoutForm = ({ order, doRequest }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);

    if (!stripe || !cardElement) return;

    const { error, token } = await stripe.createToken(cardElement);

    if (error) {
      console.error("Stripe token creation failed:", error);
      return;
    }

    await doRequest({ token: token.id });
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || !elements}>
        Pay
      </button>
    </form>
  );
};

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft <= 0) {
    return <div>Order has expired</div>;
  }

  return (
    <div>
      <h3>Time left to pay: {timeLeft} seconds</h3>
      {errors}
      <Elements stripe={stripePromise}>
        <CheckoutForm order={order} doRequest={doRequest} />
      </Elements>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
