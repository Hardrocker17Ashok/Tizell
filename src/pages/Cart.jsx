import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { auth, db } from "../firebase";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // FETCH CART ITEMS
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
  }, []);

  // SAFE PRICE HANDLER
  const getOfferPrice = (item) =>
    item.variant?.offerPrice || item.product?.offerPrice || item.offerPrice || 0;

  const getMRP = (item) =>
    item.variant?.price || item.product?.price || item.price || 0;

  // INCREASE QTY
  const increase = async (item) => {
    await updateDoc(doc(db, "cart", item.cartId), {
      quantity: (item.quantity || 1) + 1,
    });
    item.quantity = (item.quantity || 1) + 1;
    setCartItems([...cartItems]);
  };

  // DECREASE QTY
  const decrease = async (item) => {
    if ((item.quantity || 1) === 1) return;

    await updateDoc(doc(db, "cart", item.cartId), {
      quantity: item.quantity - 1,
    });
    item.quantity--;
    setCartItems([...cartItems]);
  };

  // REMOVE ITEM
  const removeItem = async (item) => {
    await deleteDoc(doc(db, "cart", item.cartId));
    setCartItems(cartItems.filter((i) => i.cartId !== item.cartId));
  };

  // TOTAL
  const total = cartItems.reduce(
    (sum, item) => sum + getOfferPrice(item) * (item.quantity || 1),
    0
  );

return (
  <div className="cart-container">

    {/* LEFT SECTION */}
    <div className="cart-left">
      <h2 className="cart-title">Shopping Cart</h2>

      {cartItems.length === 0 && (
        <div className="empty-cart">
          <img src="https://cdn-icons-png.flaticon.com/512/102/102661.png" alt="" />
          <h3>Your cart is empty</h3>
          <p>Add items to continue shopping</p>
          <button onClick={() => navigate("/")} className="start-shopping-btn">
            Start Shopping
          </button>
        </div>
      )}

      {cartItems.map((item) => (
        <div className="cart-card" key={item.cartId}>

          <div className="cart-img-box">
            <img
              src={item.product?.image || item.image}
              alt=""
              className="cart-img"
            />
          </div>

          <div className="cart-info">
            <h3 className="cart-name">{item.productName}</h3>

            {item.variant && (
              <p className="variant">Variant: <b>{item.variant.label}</b></p>
            )}

            <p className="cart-price">
              ₹{getOfferPrice(item)}
              <span className="mrp">₹{getMRP(item)}</span>
            </p>

            {/* QTY + REMOVE */}
            <div className="cart-actions">
              <div className="qty-box">
                <button className="qty-btn" onClick={() => decrease(item)}>-</button>
                <span className="qty">{item.quantity}</span>
                <button className="qty-btn" onClick={() => increase(item)}>+</button>
              </div>

              <button className="remove-btn" onClick={() => removeItem(item)}>
                ❌ Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* RIGHT SECTION SUMMARY */}
    <div className="cart-right">
      <div className="summary-card">
        <h3>Price Details</h3>

        <div className="summary-row">
          <span>Items ({cartItems.length})</span>
          <b>₹{total}</b>
        </div>

        <div className="summary-row">
          <span>Delivery Charges</span>
          <b style={{ color: "green" }}>FREE</b>
        </div>

        <hr />

        <div className="summary-row total-row">
          <span>Total Amount</span>
          <h2>₹{total}</h2>
        </div>

        <button
          className="checkout-btn"
          onClick={() => {
            if (cartItems.length === 0) {
              alert("Cart is empty");
              return;
            }
            navigate("/checkout");
          }}
        >
          Proceed to Checkout
        </button>

        <button className="add-more-btn" onClick={() => navigate("/")}>
          + Add More Items
        </button>
      </div>
    </div>
  </div>
);

};

export default Cart;
