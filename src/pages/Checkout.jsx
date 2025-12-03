import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc
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

  // Wait for login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (!user) navigate("/login");
    });
    return () => unsub();
  }, [navigate]);

  // Fetch cart
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

  // Total
  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.variant?.offerPrice || item.offerPrice) *
        (item.quantity || 1),
    0
  );

  // Remove item
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


  const handleOrder = async () => {
    const { name, phone, address, pincode, district, state } = userInfo;

    if (!name || !phone || !address || !pincode || !district || !state) {
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
                  <button className="qty-btn" onClick={() => decreaseQty(item)}>-</button>
                  <span className="qty-num">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => increaseQty(item)}>+</button>
                </div>
              </div>

              <div className="remove-col">
                <button className="sum-remove-btn" onClick={() => removeItem(item)}>
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
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
          />

          <input
            placeholder="Phone Number"
            value={userInfo.phone}
            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
          />

          <input
            placeholder="District"
            value={userInfo.district}
            onChange={(e) => setUserInfo({ ...userInfo, district: e.target.value })}
          />

          <input
            placeholder="State"
            value={userInfo.state}
            onChange={(e) => setUserInfo({ ...userInfo, state: e.target.value })}
          />

          <textarea
            placeholder="Full Address"
            rows={3}
            value={userInfo.address}
            onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
          />

          <input
            placeholder="Pincode"
            value={userInfo.pincode}
            onChange={(e) => setUserInfo({ ...userInfo, pincode: e.target.value })}
          />


       <button
  className="place-btn"
  onClick={() => {
    const { name, phone, address, pincode, district, state } = userInfo;

    if (!name.trim()) return alert("Please enter your full name");
    if (!phone.trim()) return alert("Please enter your phone number");
    if (!/^[6-9]\d{9}$/.test(phone)) 
    return alert("Please enter a valid 10-digit phone number");
    if (!district.trim()) return alert("Please enter your district");
    if (!state.trim()) return alert("Please enter your state");
    if (!address.trim()) return alert("Please enter your full address");
    if (!pincode.trim()) return alert("Please enter your pincode");
    if (pincode.length !== 6)
  return alert("Please enter a valid 6-digit pincode");


  
    navigate("/payment", {
      state: {
        cartItems: cartItems,
        total: total,
        userInfo: userInfo,
      },
    });
  }}
>
  Proceed to Payment
</button>



        </div>

      </div>
    </div>
  );
};

export default Checkout;
