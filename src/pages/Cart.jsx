import { useEffect, useState } from "react";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  const removeItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ padding: 20 }}>
      <h2>My Cart</h2>

      {cart.length === 0 ? (
        <h3>Your cart is empty</h3>
      ) : (
        <>
          {cart.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "20px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "10px",
              }}
            >
              <img
                src={item.image}
                alt=""
                style={{ width: "100px", height: "100px", objectFit: "contain" }}
              />

              <div style={{ flexGrow: 1 }}>
                <h4>{item.name}</h4>
                <p>₹ {item.price}</p>
              </div>

              <button
                style={{
                  padding: "6px 12px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
                onClick={() => removeItem(i)}
              >
                Remove
              </button>
            </div>
          ))}

          <h3>Total: ₹{total}</h3>

          <button
            className="add-btn"
            onClick={() => (window.location.href = "/checkout")}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
