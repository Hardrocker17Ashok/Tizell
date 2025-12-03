import { useLocation, useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="os-container">

      <div className="os-box">
        <img
          src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
          alt="success"
          className="os-img"
        />

        <h2>Order Placed Successfully!</h2>

        <p className="os-msg">
          {state?.message || "Your order has been placed."}
        </p>

        <button className="os-btn" onClick={() => navigate("/orders")}>
          View My Orders
        </button>

        <button className="os-back" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
