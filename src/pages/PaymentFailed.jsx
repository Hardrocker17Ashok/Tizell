import { useNavigate } from "react-router-dom";
import "./PaymentFailed.css";

const OrderFailure = () => {
  const navigate = useNavigate();

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
