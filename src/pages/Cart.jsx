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
    <div className="cart-page">

      {/* LEFT – CART ITEMS */}
      <div className="cart-left">
        <h2 className="cart-title">Shopping Cart</h2>

        {cartItems.length === 0 && <p>Your cart is empty.</p>}

        {cartItems.map((item) => (
          <div className="cart-item" key={item.cartId}>

            <img
              src={item.product?.image || item.image}
              alt=""
              className="cart-img"
            />

            <div className="cart-details">
              <h3>{item.productName}</h3>

              <p className="variant">Variant: <b>{item.variant?.label}</b></p>

              <p className="price">
                ₹{getOfferPrice(item)}
                <span className="mrp">₹{getMRP(item)}</span>
              </p>

              <div className="qty-row">
                <button className="qty-btn" onClick={() => decrease(item)}>-</button>
                <span className="qty-num">{item.quantity}</span>
                <button className="qty-btn" onClick={() => increase(item)}>+</button>
              </div>

              <button className="remove-btn" onClick={() => removeItem(item)}>
                Remove
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* RIGHT – TOTAL BOX */}
      <div className="cart-right">
        <h3>Subtotal ({cartItems.length} items)</h3>
        <h2>₹{total}</h2>

        <button
          className="checkout-btn"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>

    </div>
  );
};

export default Cart;
