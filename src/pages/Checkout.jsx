import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
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
    district: "",
    state: "",
  });

  const [loadingPin, setLoadingPin] = useState(false);

  const validateIndianPhone = (phone) => {
    phone = phone.trim();

    // Basic check
    if (!/^[0-9]{10}$/.test(phone)) return false;
    if (!/^[6-9]/.test(phone)) return false;

    if (/^(.)\1+$/.test(phone)) return false;

    
    let repeatCount = 0;
    for (let i = 1; i < phone.length; i++) {
      if (phone[i] === phone[i - 1]) repeatCount++;
    }
    if (repeatCount >= 4) return false;

    
    if (/^(\d\d)\1+$/.test(phone)) return false;


    const bad = [
      "1234567890",
      "0123456789",
      "9876543210",
      "9999999999",
      "8888888888",
      "7777777777",
      "6666666666",
      "9090909090",
      "6789123411",
      "6789012345",
    ];
    if (bad.includes(phone)) return false;

    return true;
  };

  const verifyPincode = async (pincode) => {
    if (pincode.length !== 6) return;

    try {
      setLoadingPin(true);
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      setLoadingPin(false);

      if (data[0].Status === "Success") {
        const post = data[0].PostOffice[0];

        setUserInfo((prev) => ({
          ...prev,
          district: post.District,
          state: post.State,
        }));
      } else {
        alert("Invalid Pincode");
        setUserInfo((prev) => ({
          ...prev,
          district: "",
          state: "",
        }));
      }
    } catch (err) {
      setLoadingPin(false);
      console.log("PIN API Error:", err);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (!user) navigate("/login");
    });
    return () => unsub();
  }, [navigate]);


  useEffect(() => {
    const fetchCart = async () => {
      if (!auth.currentUser) return;

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

  // -------------------------------------
  // TOTAL PRICE
  // -------------------------------------
  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.variant?.offerPrice || item.offerPrice) * (item.quantity || 1),
    0
  );

  // -------------------------------------
  // REMOVE CART ITEM
  // -------------------------------------
  const removeItem = async (item) => {
    await deleteDoc(doc(db, "cart", item.cartId));
    setCartItems(cartItems.filter((i) => i.cartId !== item.cartId));
  };

  // -------------------------------------
  // QTY UPDATE
  // -------------------------------------
  const increaseQty = async (item) => {
    await updateDoc(doc(db, "cart", item.cartId), {
      quantity: item.quantity + 1,
    });
    item.quantity++;
    setCartItems([...cartItems]);
  };

  const decreaseQty = async (item) => {
    if (item.quantity === 1) return;

    await updateDoc(doc(db, "cart", item.cartId), {
      quantity: item.quantity - 1,
    });
    item.quantity--;
    setCartItems([...cartItems]);
  };


  const handleProceedToPayment = () => {
    const { name, phone, address, pincode, district, state } = userInfo;

    if (!name.trim()) return alert("Please enter your full name");

    if (!validateIndianPhone(phone))
      return alert("❌ Please enter a valid Indian phone number");

    if (!state.trim() || !district.trim())
      return alert("❌ Invalid State or District based on Pincode");

    if (!address.trim()) return alert("Please enter your full address");

    if (!/^[1-9][0-9]{5}$/.test(pincode))
      return alert("❌ Enter valid 6-digit pincode");

    navigate("/payment", {
      state: { cartItems, total, userInfo },
    });
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>

      <div className="checkout-wrapper">
        
        {/* LEFT SUMMARY */}
        <div className="summary-box">
          <h3>Order Summary</h3>

          {cartItems.map((item) => (
            <div className="summary-item" key={item.cartId}>
              <img src={item.image} alt="" />

              <div className="sum-info">
                <p className="sum-title">{item.productName}</p>
                <p className="sum-variant">
                  Variant: <strong>{item.variant?.label}</strong>
                </p>
                <p className="sum-price">₹{item.variant?.offerPrice}</p>

                <div className="qty-box">
                  <button className="qty-btn" onClick={() => decreaseQty(item)}>
                    -
                  </button>
                  <span className="qty-num">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => increaseQty(item)}>
                    +
                  </button>
                </div>
              </div>

              <div className="remove-col">
                <button
                  className="sum-remove-btn"
                  onClick={() => removeItem(item)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="total-bar">
            <span>Total</span>
            <span>₹ {total}</span>
          </div>

          <button className="add-more-btn" onClick={() => navigate("/")}>
            + Add More Items
          </button>
        </div>

        {/* RIGHT BILLING */}
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
            maxLength={10}
            value={userInfo.phone}
            onChange={(e) =>
              setUserInfo({ ...userInfo, phone: e.target.value })
            }
          />

          <input
            placeholder="Pincode"
            maxLength={6}
            value={userInfo.pincode}
            onChange={(e) => {
              const pin = e.target.value;
              setUserInfo({ ...userInfo, pincode: pin });
              if (pin.length === 6) verifyPincode(pin);
            }}
          />

          <input
            placeholder="State"
            value={userInfo.state}
            readOnly
            style={{ background: "#eaeaea" }}
          />

          <input
            placeholder="District"
            value={userInfo.district}
            readOnly
            style={{ background: "#eaeaea" }}
          />

          <textarea
            placeholder="Full Address"
            rows={3}
            value={userInfo.address}
            onChange={(e) =>
              setUserInfo({ ...userInfo, address: e.target.value })
            }
          />

          <button className="place-btn" onClick={handleProceedToPayment}>
            {loadingPin ? "Validating..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
