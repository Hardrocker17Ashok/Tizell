import { useEffect, useState } from "react";
import { collection,query,where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import {auth, db } from "../firebase";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Fetch cart items correctly
  useEffect(() => {
  const fetchCart = async () => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "cart"),
      where("userId", "==", auth.currentUser.uid)   // ✅ filter by user
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

  // ✅ Increase quantity
  const increase = async (item) => {
    await updateDoc(doc(db, "cart", item.cartId), {
      quantity: item.quantity + 1,
    });

    item.quantity++;
    setCartItems([...cartItems]);
  };

  // ✅ Decrease quantity
  const decrease = async (item) => {
    if (item.quantity === 1) return;

    await updateDoc(doc(db, "cart", item.cartId), {
      quantity: item.quantity - 1,
    });

    item.quantity--;
    setCartItems([...cartItems]);
  };

  // ✅ Remove item
  const removeItem = async (item) => {
    await deleteDoc(doc(db, "cart", item.cartId));
    setCartItems(cartItems.filter((i) => i.cartId !== item.cartId));
  };

  // ✅ Total price
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.offerPrice * item.quantity,
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
            src={item.product.image}
            alt={item.product.name}
            style={{ width: "120px", marginRight: "20px" }}
          />

          <div style={{ flex: 1 }}>
            <h3>{item.product.name}</h3>
            <p>₹ {item.product.offerPrice}</p>

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

{/* ✅ Checkout Button */}
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
