import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  useEffect(() => {
    if (!orderId) return;

    const timer = setInterval(async () => {
      const snap = await getDoc(doc(db, "orders", orderId));

      if (!snap.exists()) return;

      const status = snap.data().paymentStatus;

      if (status === "SUCCESS") {
        clearInterval(timer);
        navigate(`/order-success?orderId=${orderId}`);
      }

      if (status === "FAILED") {
        clearInterval(timer);
        navigate(`/payment-failed?orderId=${orderId}`);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [orderId, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Processing your payment...</h2>
      <p>Please wait, do not refresh.</p>
    </div>
  );
};

export default PaymentProcessing;
