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
          
          {/* Order Header */}
          <div className="order-header">
            <div>
              <p><b>Order ID:</b> {order.id}</p>
              <p>
                <b>Date:</b> {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="order-total">
              <p><b>Total Amount:</b></p>
              <h3>₹{order.total}</h3>
            </div>
          </div>

          {/* Address */}
          <div className="order-address">
            <h4>Delivery Address</h4>
            <p><b>{order.userInfo?.name}</b></p>
            <p>{order.userInfo?.phone}</p>
            <p>{order.userInfo?.district}, {order.userInfo?.state}</p>
            <p>{order.userInfo?.address}</p>
            <p>Pincode: {order.userInfo?.pincode}</p>
          </div>

          <h4 style={{ marginTop: 15 }}>Items:</h4>

          {/* Items List */}
          {order.items.map((item, index) => (
            <div className="order-item" key={index}>
              
              <img
                src={item.image}
                alt=""
                className="order-item-img"
              />

              <div className="order-item-details">
                <p className="item-name">{item.productName}</p>
                
                <p>
                  Variant: <b>{item.variant?.label}</b>
                </p>

                <p>
                  Qty: {item.quantity} × ₹{item.variant?.offerPrice}
                </p>

                <p className="order-subtotal">
                  Subtotal: ₹{item.quantity * item.variant?.offerPrice}
                </p>
              </div>
            </div>
          ))}

      
          <button
            className="order-detail-btn"
            onClick={() => navigate(`/order/${order.id}`, { state: { order } })}
          >
            View Details
          </button>

        </div>
      ))}
    </div>
  );
};

export default Orders;
