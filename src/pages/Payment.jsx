import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Payment.css";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";


const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Total amount coming from checkout
  const total = state?.total || 0;

  const [paymentMethod, setPaymentMethod] = useState(null);
const handleProceed = async () => {
  if (!paymentMethod) {
    alert("Please select a payment method");
    return;
  }

  // prepare order object
  const orderData = {
    userId: auth.currentUser.uid,
    items: state.cartItems,
    total: total,
    userInfo: state.userInfo,
    paymentMethod,
    createdAt: Date.now(),
  };

  
  const orderRef = await addDoc(collection(db, "orders"), orderData);

  
  state.cartItems.forEach(async (item) => {
    await deleteDoc(doc(db, "cart", item.cartId));
  });


  navigate("/order-success", {
    state: {
      message:
        paymentMethod === "cod"
          ? "Cash on Delivery selected. Order placed!"
          : "Online Payment Successful!",
      orderId: orderRef.id,
    },
  });
};

  return (
    <div className="pay-container">
      <h2 className="pay-title">Select Payment Method</h2>

      <div className="pay-box">

        {/* COD OPTION */}
        <div
          className={`pay-option ${
            paymentMethod === "cod" ? "selected" : ""
          }`}
          onClick={() => {
            if (total <= 2000) {
              setPaymentMethod("cod");
            }
          }}
        >
          <input
            type="radio"
            checked={paymentMethod === "cod"}
            readOnly
          />
          <div>
            <h3>Cash on Delivery</h3>
            <p>Pay when the item is delivered.</p>
          </div>

          {total > 2000 && (
            <span className="disabled-tag">Not Available over ₹2000</span>
          )}
        </div>

        {/* ONLINE PAYMENT OPTION */}
        <div
          className={`pay-option ${
            paymentMethod === "online" ? "selected" : ""
          }`}
          onClick={() => setPaymentMethod("online")}
        >
          <input
            type="radio"
            checked={paymentMethod === "online"}
            readOnly
          />
          <div>
            <h3>Online Payment</h3>
            <p>UPI • Netbanking • Cards • Wallets</p>
          </div>
        </div>

        {/* SUMMARY BOX */}
        <div className="summary">
          <h3>Order Summary</h3>
          <p>Total Amount:</p>
          <h2>₹{total}</h2>
        </div>

        <button className="pay-btn" onClick={handleProceed}>
          Proceed
        </button>
      </div>
    </div>
  );
};

export default Payment;
