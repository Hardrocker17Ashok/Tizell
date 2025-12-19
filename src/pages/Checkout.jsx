import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const buyNowData = state?.buyNow ? state : null;

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

  // LOAD SAVED ADDRESS -----------------------------------
  const loadSavedAddress = async () => {
    if (!auth.currentUser) return;

    const userRef = doc(db, "users", auth.currentUser.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();

      const allAddresses = data.addresses || [];

      // Find primary address
      const primary = allAddresses.find((a) => a.isPrimary === true);

      // If no primary → pick first address
      const selected = primary || allAddresses[0];

      if (selected) {
        setUserInfo({
          name: selected.name,
          phone: selected.phone,
          address: selected.address,
          pincode: selected.pincode,
          district: selected.district,
          state: selected.state,
        });
      }
    }
  };


  // PHONE VALIDATION -------------------------------------
  const validateIndianPhone = (phone) => {
    phone = phone.trim();

    // 1. Must be exactly 10 digits
    if (!/^[0-9]{10}$/.test(phone)) {
      return { valid: false, reason: "Phone must be 10 digits." };
    }

    // 2. Must start with 6-9 (Indian mobile rule)
    if (!/^[6-9]/.test(phone)) {
      return { valid: false, reason: "Phone must start with 6, 7, 8, or 9." };
    }

    // 3. Reject all repeated digits (1111111111)
    if (/^(.)\1{9}$/.test(phone)) {
      return { valid: false, reason: "Repeated digits not allowed." };
    }


    const blacklist = [
      "1234567890",
      "0123456789",
      "9876543210",
      "0000000000",
      "9999999999",
      "8888888888",
      "7777777777",
      "6666666666"
    ];

    if (blacklist.includes(phone)) {
      return { valid: false, reason: "This phone number looks fake." };
    }


    const ascending = "01234567890123456789";
    if (ascending.includes(phone)) {
      return { valid: false, reason: "Sequential numbers are invalid." };
    }


    const descending = "98765432109876543210";
    if (descending.includes(phone)) {
      return { valid: false, reason: "Reverse sequential numbers are invalid." };
    }


    const counts = {};
    for (let digit of phone) {
      counts[digit] = (counts[digit] || 0) + 1;
      if (counts[digit] >= 6) {
        return { valid: false, reason: "Too many repeated digits." };
      }
    }


    return { valid: true, reason: "Valid Indian phone number." };
  };


  // PINCODE LOOKUP ---------------------------------------
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
        setUserInfo((prev) => ({ ...prev, district: "", state: "" }));
      }
    } catch (err) {
      setLoadingPin(false);
      console.log("PIN API Error:", err);
    }
  };

  // WAIT FOR LOGIN ---------------------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (!user) navigate("/login");
      else loadSavedAddress();
    });
    return () => unsub();
  }, [navigate]);

  // FETCH CART  ----------------------
  useEffect(() => {
    const fetchCart = async () => {
      if (!auth.currentUser || buyNowData) return;

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

  const itemsToShow = buyNowData
    ? [
      {
        cartId: "buynow",
        productName: buyNowData.product.name,
        image: buyNowData.product.image,
        variant: buyNowData.variant,
        quantity: buyNowData.quantity,
      },
    ]
    : cartItems;

  const total = itemsToShow.reduce(
    (sum, item) =>
      sum + item.variant.offerPrice * (item.quantity || 1),
    0
  );

  // REMOVE  
  const removeItem = async (item) => {
    if (item.cartId === "buynow") return;
    await deleteDoc(doc(db, "cart", item.cartId));
    setCartItems(cartItems.filter((i) => i.cartId !== item.cartId));
  };

  const increaseQty = async (item) => {
    if (item.cartId === "buynow") return;

    await updateDoc(doc(db, "cart", item.cartId), {
      quantity: item.quantity + 1,
    });

    item.quantity++;
    setCartItems([...cartItems]);
  };

  const decreaseQty = async (item) => {
    if (item.cartId === "buynow") return;
    if (item.quantity === 1) return;

    await updateDoc(doc(db, "cart", item.cartId), {
      quantity: item.quantity - 1,
    });

    item.quantity--;
    setCartItems([...cartItems]);
  };

  // SAVE ADDRESS 
  const saveCheckoutAddressToArray = async () => {
    if (!auth.currentUser) return;

    const userRef = doc(db, "users", auth.currentUser.uid);
    const snap = await getDoc(userRef);

    let existing = snap.exists() ? snap.data().addresses || [] : [];

    // Create unique id
    const id = crypto.randomUUID();

    // If no address exists → make this primary
    const isPrimary = existing.length === 0 ? true : false;

    // Create new address object
    const newAddr = {
      ...userInfo,
      id,
      isPrimary,
    };

    let updated = [...existing, newAddr];


    if (isPrimary) {
      updated = [newAddr, ...existing.map(a => ({ ...a, isPrimary: false }))];
    }

    // Save to Firestore
    await setDoc(
      userRef,
      { addresses: updated },
      { merge: true }
    );
  };



  // PROCEED TO PAYMENT 
  const handleProceedToPayment = async () => {
    const { name, phone, address, pincode, district, state } = userInfo;

    if (!name.trim()) return alert("Please enter your full name");
    if (!validateIndianPhone(phone))
      return alert("Please enter a valid Indian phone number");
    if (!state.trim() || !district.trim())
      return alert("Invalid State or District based on Pincode");
    if (!address.trim()) return alert("Please enter your full address");
    if (!/^[1-9][0-9]{5}$/.test(pincode))
      return alert("Enter valid 6-digit pincode");

    await saveCheckoutAddressToArray();


    navigate("/payment", {
      state: { cartItems: itemsToShow, total, userInfo },
    });
  };


  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>

      <div className="checkout-wrapper">

        {/* LEFT SUMMARY */}
        <div className="summary-box">
          <h3>Order Summary</h3>

          {itemsToShow.map((item) => (
            <div className="summary-item" key={item.cartId}>
              <img src={item.image} alt="" />

              <div className="sum-info">
                <p className="sum-title">{item.productName}</p>
                <p className="sum-variant">
                  Variant: <strong>{item.variant?.label}</strong>
                </p>
                <p className="sum-price">₹{item.variant?.offerPrice}</p>

                {!buyNowData && (
                  <div className="qty-box">
                    <button className="qty-btn" onClick={() => decreaseQty(item)}>
                      -
                    </button>
                    <span className="qty-num">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => increaseQty(item)}>
                      +
                    </button>
                  </div>
                )}
              </div>

              {!buyNowData && (
                <div className="remove-col">
                  <button
                    className="sum-remove-btn"
                    onClick={() => removeItem(item)}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="total-bar">
            <span>Total</span>
            <span>₹ {total}</span>
          </div>

          {!buyNowData && (
            <button className="add-more-btn" onClick={() => navigate("/")}>
              + Add More Items
            </button>
          )}
        </div>

        {/* RIGHT BILLING */}
        <div className="form-box">
          <h3>Billing Details</h3>

          <input
            placeholder="Full Name"
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
          />

          <input
            placeholder="Phone Number"
            maxLength={10}
            value={userInfo.phone}
            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
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
