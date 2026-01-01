import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLoader } from "../context/LoaderContext";
import "./PaymentFailed.css";

const OrderFailure = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoader();

  useEffect(() => {
    // show loader when page opens
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // small delay for smooth UX

    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <div className="failure-container">
      <h1>❌ Payment Failed</h1>

      <p>
        Your payment could not be completed.  
        No money was deducted.
      </p>

      <button onClick={() => navigate("/checkout")}>
        Try Again
      </button>

      <button onClick={() => navigate("/")}>
        Go to Home
      </button>
    </div>
  );
};

export default OrderFailure;
