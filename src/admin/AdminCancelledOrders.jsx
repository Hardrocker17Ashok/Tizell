import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import "./AdminOrders.css";

const AdminCancelledOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("status", "==", "Cancelled"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setOrders(list);
    });

    return () => unsub();
  }, []);

  return (
    <div className="admin-orders">

      <div className="admin-orders-header">
        <h2>❌ Cancelled Orders</h2>
        <span className="count-badge">{orders.length}</span>
      </div>

      {orders.length === 0 && (
        <p className="empty-text">No cancelled orders found.</p>
      )}

      {orders.map(order => (
        <div className="admin-order-card" key={order.id}>

          {/* HEADER */}
          <div className="order-top">
            <div>
              <p className="order-id">Order #{order.id}</p>
              <p className="order-date">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <span className="status cancelled">Cancelled</span>
          </div>

          {/* CUSTOMER */}
          <div className="order-user">
            <b>{order.address?.name}</b> • {order.address?.phone}
          </div>

          {/* ITEMS */}
          <div className="order-items">
            {order.items.map((item, i) => (
              <div className="order-item" key={i}>
                <div>
                  <p className="item-name">{item.productName}</p>
                  <p className="item-meta">
                    Qty: {item.quantity} × ₹{item.variant?.offerPrice}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="order-footer">
            <p>Total Amount</p>
            <h3>₹{order.total}</h3>
          </div>

        </div>
      ))}
    </div>
  );
};

export default AdminCancelledOrders;
