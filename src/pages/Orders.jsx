import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";


const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  const fetchOrders = async () => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "orders"),
      where("userId", "==", auth.currentUser.uid)   // ✅ filter by user
    );

    const snap = await getDocs(q);
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setOrders(list);
  };

  fetchOrders();
}, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Orders</h2>

      {orders.length === 0 && <p>No orders found.</p>}

      {orders.map((order) => (
        <div
          key={order.orderId}
          style={{
            padding: 15,
            border: "1px solid #ddd",
            borderRadius: "10px",
            marginBottom: 20,
            background: "#f9f9f9",
          }}
        >
          <h3>Order ID: {order.orderId}</h3>

          <p><b>Total:</b> ₹{order.total}</p>

          <p><b>Name:</b> {order.userInfo?.name}</p>
          <p><b>Phone:</b> {order.userInfo?.phone}</p>
          <p><b>Address:</b> {order.userInfo?.address}</p>
          <p><b>Pincode:</b> {order.userInfo?.pincode}</p>

          <p>
            <b>Order Date:</b>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>

          <h4 style={{ marginTop: 15 }}>Items:</h4>

          {order.items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                padding: "8px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <img
                src={item.product?.image}
                alt={item.product?.name}
                style={{
                  width: 70,
                  height: 70,
                  objectFit: "contain",
                  marginRight: 15,
                  borderRadius: 6,
                  background: "#fff",
                  padding: 5,
                }}
              />

              <div>
                <p style={{ fontWeight: "bold" }}>
                  {item.product?.name}
                </p>
                <p>
                  Qty: {item.quantity} × ₹{item.product?.offerPrice}
                </p>
                <p style={{ color: "green" }}>
                  Subtotal: ₹{item.quantity * item.product?.offerPrice}
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Orders;
