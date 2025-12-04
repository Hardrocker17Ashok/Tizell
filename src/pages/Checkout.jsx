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
  const [loadingPhone, setLoadingPhone] = useState(false);


  const verifyPhoneNumber = async (phone) => {
    if (phone.length !== 10) return { valid: false };

    try {
      setLoadingPhone(true);
      const res = await fetch(
        `https://phoneintelligence.abstractapi.com/v1/?api_key=ace8a8b87abb4c258f289d46656a544a&phone=14152007986`
      );

      const data = await res.json();
      setLoadingPhone(false);

      if (data?.data?.length > 0) {
        return {
          valid: true,
          name: data.data[0]?.name || null,
          carrier: data.data[0]?.carrier || null,
          score: data.data[0]?.score || 0,
        };
      }

      return { valid: false };
    } catch (err) {
      setLoadingPhone(false);
      console.log("Phone API Error:", err);
      return { valid: false };
    }
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
        alert(" Invalid Pincode");
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

  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.variant?.offerPrice || item.offerPrice) * (item.quantity || 1),
    0
  );

  
  const removeItem = async (item) => {
    await deleteDoc(doc(db, "cart", item.cartId));
    setCartItems(cartItems.filter((i) => i.cartId !== item.cartId));
  };


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
    if (!/^[6-9]\d{9}$/.test(phone))
      return alert("Enter valid Indian phone number");

    if (!state.trim() || !district.trim())
      return alert("Please enter valid state & district");

    if (!address.trim()) return alert("Enter your full address");
    if (!pincode.trim() || pincode.length !== 6)
      return alert("Enter valid 6-digit pincode");

    navigate("/payment", {
      state: { cartItems, total, userInfo },
    });
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>

      <div className="checkout-wrapper">
      
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
            onChange={async (e) => {
              const phone = e.target.value;
              setUserInfo({ ...userInfo, phone });

              // if (phone.length === 10) {
              //   const result = await verifyPhoneNumber(phone);

              //   if (!result.valid) {
              //     alert("Invalid or unregistered phone number!");
              //   }
              // }
            }}
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

          {/* ADDRESS */}
          <textarea
            placeholder="Full Address"
            rows={3}
            value={userInfo.address}
            onChange={(e) =>
              setUserInfo({ ...userInfo, address: e.target.value })
            }
          />

          {/* BUTTON */}
          <button className="place-btn" onClick={handleProceedToPayment}>
            {loadingPhone || loadingPin ? "Validating..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
