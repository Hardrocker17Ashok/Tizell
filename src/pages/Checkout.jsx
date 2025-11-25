import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  // ✅ Wait for real login state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (!user) navigate("/login");
    });
    return () => unsub();
  }, [navigate]);

  // ✅ Fetch logged user cart only
  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchCart = async () => {
      const q = query(
        collection(db, "cart"),
        where("userId", "==", auth.currentUser.uid)
      );

      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({
        cartId: d.id,
        ...d.data(),
      }));

      setCartItems(list);
    };

    fetchCart();
  }, [auth.currentUser]);

  if (loading) return null;

  // ✅ Total
  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      ((item.product?.offerPrice || item.offerPrice) *
        (item.quantity || 1)),
    0
  );

  // ✅ Place Order
  const handleOrder = async () => {
    const { name, phone, address, pincode } = userInfo;

    if (!name || !phone || !address || !pincode) {
      alert("Please fill all details");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        userId: auth.currentUser.uid,
        items: cartItems,
        total,
        userInfo,
        createdAt: Date.now(),
      });

      cartItems.forEach(async (item) => {
        await deleteDoc(doc(db, "cart", item.cartId));
      });

      alert("Order Placed Successfully!");
      navigate("/orders");
    } catch (error) {
      console.error(error);
      alert("Order failed. Try again.");
    }
  };

  return (
    <div className="checkout-container">

      <h2 className="checkout-title">Checkout</h2>

      <div className="checkout-wrapper">

        {/* ✅ LEFT — ORDER SUMMARY */}
        <div className="summary-box">
          <h3>Order Summary</h3>

          {cartItems.map((item) => (
            <div className="summary-item" key={item.cartId}>
              <img src={item.product?.image || item.image} alt="" />
              <div>
                <p>{item.product?.name || item.name}</p>
                <strong>₹ {item.product?.offerPrice || item.offerPrice}</strong>
                <p>Qty: {item.quantity}</p>
              </div>
            </div>
          ))}

          <div className="total-bar">
            <span>Total</span>
            <span>₹ {total}</span>
          </div>
        </div>

        {/* ✅ RIGHT — ADDRESS FORM */}
        <div className="form-box">
          <h3>Billing Details</h3>

          <input
            placeholder="Full Name"
            value={userInfo.name}
            onChange={(e) =>
              setUserInfo({ ...userInfo, name: e.target.value })
            }
          />

          <input
            placeholder="Phone Number"
            value={userInfo.phone}
            onChange={(e) =>
              setUserInfo({ ...userInfo, phone: e.target.value })
            }
          />

          <textarea
            placeholder="Full Address"
            rows={3}
            value={userInfo.address}
            onChange={(e) =>
              setUserInfo({ ...userInfo, address: e.target.value })
            }
          />

          <input
            placeholder="Pincode"
            value={userInfo.pincode}
            onChange={(e) =>
              setUserInfo({ ...userInfo, pincode: e.target.value })
            }
          />

          <button className="place-btn" onClick={handleOrder}>
            Place Order
          </button>
        </div>

      </div>

    </div>
  );
};

export default Checkout;
