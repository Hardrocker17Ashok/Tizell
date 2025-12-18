import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Payment.css";
import { addDoc, collection, deleteDoc, setDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const total = state?.total || 0;
  const [paymentMethod, setPaymentMethod] = useState(null);

  const DELIVERY_CHARGE = 90;
  const isCOD = paymentMethod === "cod";



  const handleProceed = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    // Normalize address format
    const addressData = {
      name: state.userInfo?.name || "",
      phone: state.userInfo?.phone || "",
      address: state.userInfo?.address || "",
      district: state.userInfo?.district || "",
      state: state.userInfo?.state || "",
      pincode: state.userInfo?.pincode || "",
    };

    //  REQUIRED ORDER STRUCTURE WITH "status"
    const orderData = {
      userId: auth.currentUser.uid,
      // items: state.cartItems,
      items: state.cartItems.map((item) => {
        const cleanItem = { ...item };

        // ✅ add productDocId ONLY if it exists
        if (item.productDocId || item.docId || item.firestoreId) {
          cleanItem.productDocId =
            item.productDocId || item.docId || item.firestoreId;
        }

        return cleanItem;
      }),
      total: isCOD ? total + DELIVERY_CHARGE : total,
      address: state.userInfo,
      paymentMethod,
      deliveryCharge: isCOD ? DELIVERY_CHARGE : 0,
      paymentStatus: isCOD ? "Pending" : "Paid",
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



    // SAVE ORDER
    const orderRef = await addDoc(collection(db, "orders"), orderData);

    // REMOVE ITEMS FROM CART 
    for (let item of state.cartItems) {
      if (item.cartId !== "buynow") {
        await deleteDoc(doc(db, "cart", item.cartId));
      }
    }

    // REDIRECT TO SUCCESS PAGE
    navigate("/order-success", {
      state: {
        message:
          paymentMethod === "cod"
            ? "Cash on Delivery selected. Order placed!"
            : "Online Payment Successful!",
        orderId: orderRef.id,
        items: state.cartItems,
      },
    });

  };
  return (
    <div className="payment-container">

      <div className="payment-card">
        <h2 className="section-title">Select Payment Method</h2>

        {/* PAYMENT OPTIONS */}
        <div className="payment-options">

          {/* COD */}
          <div
            className={`payment-option ${paymentMethod === "cod" ? "active" : ""} 
            ${total > 2000 ? "disabled" : ""}`}
            onClick={() => total <= 2000 && setPaymentMethod("cod")}
          >
            <div className="option-left">
              <span className="icon">💵</span>
              <div>
                <h3>Cash on Delivery</h3>
                <p>Pay when your order arrives</p>
              </div>
            </div>

            {total > 2000 && <span className="tag-red">Not available above ₹2000</span>}
            <input type="radio" checked={paymentMethod === "cod"} readOnly />
          </div>

          {/* ONLINE PAYMENT */}
          <div
            className={`payment-option ${paymentMethod === "online" ? "active" : ""}`}
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

        {/* ORDER SUMMARY */}
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

        {/* BUTTON */}
        <button className="pay-btn" onClick={handleProceed}>
          Proceed to Pay
        </button>
      </div>
    </div>
  );

};

export default Payment;
