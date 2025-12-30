import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Payment.css";
import { addDoc, collection, deleteDoc, setDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import axios from "axios";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const total = state?.total || 0;
  const [paymentMethod, setPaymentMethod] = useState(null);

  const DELIVERY_CHARGE = 90;
  const isCOD = paymentMethod === "cod";


  const startPayUPayment = async (amount) => {
    try {
      const finalAmount = Number(amount);
      if (!finalAmount || isNaN(finalAmount)) return;

      const orderId = "ORD" + Date.now();

      //  create order first
      await setDoc(doc(db, "orders", orderId), {
        orderId,
        userId: auth.currentUser.uid,
        items: state.cartItems,
        address: state.userInfo,
        total: finalAmount,
        paymentStatus: "PENDING",
        status: "Pending",
        paymentMethod: "ONLINE",
        createdAt: Date.now(),
      });

      const res = await axios.post(
        "https://us-central1-myshope-1ff26.cloudfunctions.net/createPayUPayment",
        {
          txnid: orderId,
          amount: finalAmount.toFixed(2),
          productinfo: "Order Payment",
          firstname: state.userInfo?.name,
          email: auth.currentUser.email,
          phone: state.userInfo?.phone,
          udf1: auth.currentUser.uid,
          udf2: JSON.stringify(state.cartItems),
          surl: "https://us-central1-myshope-1ff26.cloudfunctions.net/paymentSuccess",
          furl: "https://us-central1-myshope-1ff26.cloudfunctions.net/paymentFailure",
        }
      );

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://secure.payu.in/_payment";

      Object.entries(res.data).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("PAYMENT ERROR:", err);
      alert("Payment initiation failed");
    }
  };





  // MAIN HANDLER

  const handleProceed = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    // ONLINE PAYMENT
    if (paymentMethod === "online") {
      startPayUPayment(total);
      return;
    }

    // CASH ON DELIVERY

    const orderData = {
      userId: auth.currentUser.uid,
      items: state.cartItems.map((item) => {
        const cleanItem = { ...item };
        if (item.productDocId || item.docId || item.firestoreId) {
          cleanItem.productDocId =
            item.productDocId || item.docId || item.firestoreId;
        }
        return cleanItem;
      }),
      total: total + DELIVERY_CHARGE,
      address: state.userInfo,
      paymentMethod,
      deliveryCharge: DELIVERY_CHARGE,
      paymentStatus: "Pending",
      status: "Pending",
      createdAt: Date.now(),
    };

    await setDoc(
      doc(db, "users", auth.currentUser.uid),
      {
        name: state.userInfo.name,
        email: auth.currentUser.email,
        phone: state.userInfo.phone,
      },
      { merge: true }
    );

    const orderRef = await addDoc(collection(db, "orders"), orderData);

    await addDoc(collection(db, "adminNotifications"), {
      type: "NEW_ORDER",
      orderId: orderRef.id,
      userId: auth.currentUser.uid,
      message: `🛒 New order placed: #${orderRef.id}`,
      read: false,
      createdAt: Date.now(),
    });

    for (let item of state.cartItems) {
      if (item.cartId !== "buynow") {
        await deleteDoc(doc(db, "cart", item.cartId));
      }
    }

    navigate("/order-success", {
      state: {
        message: "Cash on Delivery selected. Order placed!",
        orderId: orderRef.id,
        items: state.cartItems,
      },
    });
  };


  // UI

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="section-title">Select Payment Method</h2>

        <div className="payment-options">
          <div
            className={`payment-option 
    ${paymentMethod === "cod" ? "active" : ""} 
    ${total > 199 ? "disabled" : ""}
  `}
            onClick={() => {
              if (total <= 199) {
                setPaymentMethod("cod");
              }
            }}
          >
            <div className="option-left">
              <span className="icon">💵</span>
              <div>
                <h3>Cash on Delivery</h3>

                {total <= 199 ? (
                  <p>Pay when your order arrives</p>
                ) : (
                  <p className="cod-warning">
                    Cash on Delivery available only for orders under ₹200
                  </p>
                )}
              </div>
            </div>

            <input
              type="radio"
              checked={paymentMethod === "cod"}
              disabled={total > 199}
              readOnly
            />
          </div>


          <div
            className={`payment-option ${paymentMethod === "online" ? "active" : ""
              }`}
            onClick={() => setPaymentMethod("online")}
          >
            <div className="option-left">
              <span className="icon">💳</span>
              <div>
                <h3>Online Payment</h3>
                <p>UPI • Cards • Netbanking • Wallets</p>
              </div>
            </div>
            <input type="radio" checked={paymentMethod === "online"} readOnly />
          </div>
        </div>

        <div className="summary-card">
          <h3>Order Summary</h3>
          <div className="row">
            <span>Subtotal</span>
            <b>₹{total}</b>
          </div>
          <div className="row">
            <span>Delivery Charge</span>
            <b style={{ color: isCOD ? "#d9534f" : "#28a745" }}>
              {isCOD ? `₹${DELIVERY_CHARGE}` : "FREE"}
            </b>
          </div>
          <hr />
          <div className="row total">
            <span>Total Payable</span>
            <h2>₹{isCOD ? total + DELIVERY_CHARGE : total}</h2>
          </div>
        </div>

        <button className="pay-btn" onClick={handleProceed}>
          Proceed to Pay
        </button>
      </div>
    </div>
  );
};

export default Payment;
