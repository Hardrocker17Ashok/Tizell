import { useEffect, useState } from "react";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

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

  // 🔥 SAFE PRICE HANDLER (NO MORE ERRORS)
  const getOfferPrice = (item) => {
    return (
      item.variant?.offerPrice ||
      item.product?.offerPrice ||
      item.offerPrice ||
      0
    );
  };

  const getMRP = (item) => {
    return (
      item.variant?.price ||
      item.product?.price ||
      item.price ||
      0
    );
  };

  // 🔥 Increase
  const increase = async (item) => {
    await updateDoc(doc(db, "cart", item.cartId), {
      quantity: (item.quantity || 1) + 1,
    });

    item.quantity = (item.quantity || 1) + 1;
    setCartItems([...cartItems]);
  };

  // 🔥 Decrease
  const decrease = async (item) => {
    if ((item.quantity || 1) === 1) return;

    await updateDoc(doc(db, "cart", item.cartId), {
      quantity: item.quantity - 1,
    });

    item.quantity--;
    setCartItems([...cartItems]);
  };

  // 🔥 Remove
  const removeItem = async (item) => {
    await deleteDoc(doc(db, "cart", item.cartId));
    setCartItems(cartItems.filter((i) => i.cartId !== item.cartId));
  };

  // 🔥 Total
  const total = cartItems.reduce(
    (sum, item) => sum + getOfferPrice(item) * (item.quantity || 1),
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Cart</h1>

      {cartItems.length === 0 && <p>No items in cart.</p>}

      {cartItems.map((item) => (
        <div
          key={item.cartId}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "15px",
          }}
        >
          <img
            src={item.product?.image || item.image}
            alt=""
            style={{ width: "120px", marginRight: "20px" }}
          />

          <div style={{ flex: 1 }}>
            <h3>{item.product?.name}</h3>

            <p>Variant: <b>{item.variant?.label || "Default"}</b></p>

            <p>
              Price: <b>₹{getOfferPrice(item)}</b>&nbsp;
              <span style={{ textDecoration: "line-through", color: "#777" }}>
                ₹{getMRP(item)}
              </span>
            </p>

            <div>
              <button onClick={() => decrease(item)}>-</button>
              <span style={{ margin: "0 10px" }}>{item.quantity}</span>
              <button onClick={() => increase(item)}>+</button>
            </div>

            <button
              onClick={() => removeItem(item)}
              style={{ marginTop: "10px", color: "red" }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <h2>Total: ₹ {total}</h2>

      <button
        onClick={() => (window.location.href = "/checkout")}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          background: "green",
          color: "white",
          fontSize: "16px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
