import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  updateDoc,
  doc,
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  // const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "orders"),
      where("userId", "==", auth.currentUser.uid),
      // orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setOrders(list);
    });

    return () => unsubscribe();
  }, []);


  const cancelOrder = async (order) => {
    const confirm = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirm) return;

    //  Block cancellation if already delivered / out for delivery
    if (
      order.status === "Delivered" ||
      order.status === "Out for Delivery"
    ) {
      alert("Order cannot be cancelled at this stage.");
      return;
    }

    // 1️ Update order status
    await updateDoc(doc(db, "orders", order.id), {
      status: "Cancelled",
    });

    // 2️ Notify customer
    await addDoc(collection(db, "notifications"), {
      userId: order.userId,
      title: "❌ Order Cancelled",
      message: `Your order #${order.id} has been cancelled successfully.`,
      read: false,
      createdAt: Date.now(),
    });

    // 3️ Notify admin
    await addDoc(collection(db, "adminNotifications"), {
      type: "ORDER_CANCELLED",
      orderId: order.id,
      userId: order.userId,
      message: `Order #${order.id} was cancelled by customer.`,
      read: false,
      createdAt: Date.now(),
    });

  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">Your Orders</h2>

      {orders.length === 0 && (
        <p className="empty-text">No orders found.</p>
      )}

      {orders.map((order) => (
        <div className="order-card" key={order.id}>
          
          <div className="order-header">
            <div>
              <p>
                <b>Order ID:</b> {order.id}
              </p>
              <p>
                <b>Date:</b>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="order-total">
              <p>
                <b>Total Amount:</b>
              </p>
              <h3>₹{order.total}</h3>

              {order.deliveryCharge > 0 && (
                <p style={{ color: "red" }}>
                  + ₹{order.deliveryCharge} Delivery Charge (COD)
                </p>
              )}
            </div>
          </div>

          {/*  STATUS */}
          <p>
            <b>Status:</b>{" "}
            <span
              className={`order-status-badge status-${order.status
                ?.toLowerCase()
                .replace(/ /g, "-")}`}
            >
              {order.status}
              {order.status !== "Cancelled" &&
                order.status !== "Delivered" &&
                order.status !== "Out for Delivery" && (
                  <button
                    className="cancel-btn"
                    onClick={() => cancelOrder(order)}
                  >
                    Cancel Order
                  </button>
                )}

            </span>
          </p>

          {/* STATUS TIMELINE  */}
          <div className="order-timeline">
            {["Pending", "Shipped", "Out for Delivery", "Delivered"].map(
              (step, index) => {
                const steps = ["Pending", "Shipped", "Out for Delivery", "Delivered"];
                const currentIndex = steps.indexOf(order.status);

                let state = "upcoming";

                if (order.status === "Cancelled") {
                  state = "cancelled";
                } else if (index < currentIndex) {
                  state = "completed";
                } else if (index === currentIndex) {
                  state = "active";
                }

                return (
                  <div className="timeline-step" key={step}>
                    <div className={`timeline-circle ${state}`}></div>
                    <p className={`timeline-text ${state}`}>{step}</p>

                    {index < steps.length - 1 && (
                      <div className={`timeline-bar ${state}`}></div>
                    )}
                  </div>
                );
              }
            )}
          </div>



          {/* PAYMENT  */}
          <p>
            <b>Payment:</b>{" "}
            <span
              className={`payment-badge payment-${order.paymentStatus?.toLowerCase()}`}
            >
              {order.paymentStatus}
            </span>
          </p>

          {/* DELIVERY ADDRESS  */}
          <div className="order-address">
            <h4>Delivery Address</h4>

            <p>
              <b>{order.address?.name}</b>
            </p>
            <p>{order.address?.phone}</p>
            <p>
              {order.address?.district}, {order.address?.state}
            </p>
            <p>{order.address?.address}</p>
            <p>Pincode: {order.address?.pincode}</p>
          </div>

          <h4 style={{ marginTop: 15 }}>Items:</h4>

          {/* ORDER ITEMS */}
          {order.items.map((item, index) => (
            <div className="order-item" key={index}>
              <img
                src={item.image}
                alt=""
                className="order-item-img"
              />

              <div className="order-item-details">
                <p className="item-name">
                  {item.productName}
                </p>

                <p>
                  Variant: <b>{item.variant?.label}</b>
                </p>
                <p>
                  Qty: {item.quantity} × ₹
                  {item.variant?.offerPrice}
                </p>

                <p className="order-subtotal">
                  Subtotal: ₹
                  {item.quantity *
                    item.variant?.offerPrice}
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
