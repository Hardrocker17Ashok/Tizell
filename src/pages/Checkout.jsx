import { useEffect, useState } from "react";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleOrder = () => {
    if (
      !userInfo.name ||
      !userInfo.phone ||
      !userInfo.address ||
      !userInfo.pincode
    ) {
      alert("Please fill all details");
      return;
    }

    // For now local storage only → later will send to Firebase
    alert("Order Placed Successfully!");
    localStorage.removeItem("cart");
    window.location.href = "/orders";
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2>Checkout</h2>

      {/* Billing Form */}
      <div>
        <label>Name:</label>
        <input
          className="input"
          value={userInfo.name}
          onChange={(e) =>
            setUserInfo({ ...userInfo, name: e.target.value })
          }
        />

        <label>Phone:</label>
        <input
          className="input"
          value={userInfo.phone}
          onChange={(e) =>
            setUserInfo({ ...userInfo, phone: e.target.value })
          }
        />

        <label>Address:</label>
        <textarea
          className="input"
          value={userInfo.address}
          onChange={(e) =>
            setUserInfo({ ...userInfo, address: e.target.value })
          }
        />

        <label>Pincode:</label>
        <input
          className="input"
          value={userInfo.pincode}
          onChange={(e) =>
            setUserInfo({ ...userInfo, pincode: e.target.value })
          }
        />
      </div>

      <h3 style={{ marginTop: 20 }}>Total: ₹{total}</h3>

      <button className="add-btn" onClick={handleOrder}>
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
