import { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  // For now, dummy orders → later from Firebase
  useEffect(() => {
    setOrders([
      {
        id: "101",
        product: "iPhone 15",
        price: 79999,
        status: "Delivered",
      },
      {
        id: "102",
        product: "Samsung S23",
        price: 69999,
        status: "Shipped",
      },
    ]);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            padding: 15,
            borderBottom: "1px solid #ddd",
            marginBottom: 15,
          }}
        >
          <h4>Order ID: {order.id}</h4>
          <p>Product: {order.product}</p>
          <p>Price: ₹{order.price}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Orders;
