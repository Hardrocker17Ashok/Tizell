import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "orders"),
        where("userId", "==", auth.currentUser.uid)
      );

      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOrders(list);
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-container">

      <h2 className="orders-title">Your Orders</h2>

      {orders.length === 0 && (
        <p className="empty-text">No orders found.</p>
      )}

      {orders.map((order) => (
        <div className="order-card" key={order.id}>

          {/* -------- ORDER HEADER -------- */}
          <div className="order-header">
            <div>
              <p><b>Order ID:</b> {order.id}</p>
              <p><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</p>
            </div>

            <div className="order-total">
              <p><b>Total Amount:</b></p>
              <h3>₹{order.total}</h3>
              {order.deliveryCharge > 0 && (
                <p style={{ color: "red" }}>
                  + ₹{order.deliveryCharge} Delivery Charge (COD)
                </p>
              )}

            </div>
          </div>

          {/* -------- NEW STATUS FIELDS -------- */}
          {/* STATUS BADGE */}
          <p>
            <b>Status:</b>
            <span className={`order-status-badge status-${order.status?.toLowerCase().replace(/ /g, "-")}`}>
              {order.status}
            </span>
          </p>

          {/* PAYMENT BADGE */}
          <p>
            <b>Payment:</b>
            <span className={`payment-badge payment-${order.paymentStatus?.toLowerCase()}`}>
              {order.paymentStatus}
            </span>
          </p>


          {/* -------- DELIVERY ADDRESS -------- */}
          <div className="order-address">
            <h4>Delivery Address</h4>

            <p><b>{order.address?.name}</b></p>
            <p>{order.address?.phone}</p>
            <p>{order.address?.district}, {order.address?.state}</p>
            <p>{order.address?.address}</p>
            <p>Pincode: {order.address?.pincode}</p>
          </div>

          <h4 style={{ marginTop: 15 }}>Items:</h4>

          {/* -------- ORDERED ITEMS LIST -------- */}
          {order.items.map((item, index) => (
            <div className="order-item" key={index}>

              <img
                src={item.image}
                alt=""
                className="order-item-img"
              />

              <div className="order-item-details">
                <p className="item-name">{item.productName}</p>

                <p>Variant: <b>{item.variant?.label}</b></p>
                <p>Qty: {item.quantity} × ₹{item.variant?.offerPrice}</p>

                <p className="order-subtotal">
                  Subtotal: ₹{item.quantity * item.variant?.offerPrice}
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
