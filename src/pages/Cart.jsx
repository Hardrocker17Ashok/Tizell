import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Fetch all cart items
  useEffect(() => {
    const fetchCart = async () => {
      const snap = await getDocs(collection(db, "cart"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCartItems(list);
    };
    fetchCart();
  }, []);

  // Increase quantity
  const increase = async (item) => {
    await updateDoc(doc(db, "cart", item.id), {
      quantity: item.quantity + 1,
    });

    item.quantity++;
    setCartItems([...cartItems]);
  };

  // Decrease quantity
  const decrease = async (item) => {
    if (item.quantity === 1) return;

    await updateDoc(doc(db, "cart", item.id), {
      quantity: item.quantity - 1,
    });

    item.quantity--;
    setCartItems([...cartItems]);
  };

  // Remove item
  const removeItem = async (item) => {
    await deleteDoc(doc(db, "cart", item.id));
    setCartItems(cartItems.filter((i) => i.id !== item.id));
  };

  // Total price calculation
  const total = cartItems.reduce(
    (sum, item) => sum + item.offerPrice * item.quantity,
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Cart</h1>

      {cartItems.length === 0 && (
        <p>No items in cart.</p>
      )}

      {cartItems.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "15px",
          }}
        >
          <img
            src={item.image}
            alt={item.name}
            style={{ width: "120px", marginRight: "20px" }}
          />

          <div style={{ flex: 1 }}>
            <h3>{item.name}</h3>
            <p>₹ {item.offerPrice}</p>

            {/* Quantity controls */}
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

      {/* Total */}
      <h2>Total: ₹ {total}</h2>
    </div>
  );
};

export default Cart;
