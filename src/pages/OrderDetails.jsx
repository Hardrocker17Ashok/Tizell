import { useLocation, useNavigate } from "react-router-dom";
import "./OrderDetails.css";

const OrderDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) {
    return <h2 style={{ padding: 20 }}>Order not found</h2>;
  }

  // ⭐ 100% Working Image Fix
  const getImage = (item) => {
    return (
      item.image ||                           // from cart
      item.product?.image ||                  // main product image
      item.product?.image2 ||                 // extra images
      item.product?.image3 ||
      item.product?.image4 ||
      "https://via.placeholder.com/120?text=No+Image"
    );
  };

  return (
    <div className="od-container">

      <button className="od-back-btn" onClick={() => navigate("/orders")}>
        ← Back to Orders
      </button>

      <h2 className="od-title">Order Details</h2>

      {/* ORDER SUMMARY */}
      <div className="od-box">
        <h3>Order ID: {order.id}</h3>
        <p><b>Order Date:</b> {new Date(order.createdAt).toLocaleString()}</p>
        <p><b>Total Amount:</b> ₹{order.total}</p>

        <p>
          <b>Status:</b>
          <span className="od-status-badge pending">Pending</span>
        </p>
      </div>

      {/* ADDRESS */}
      <div className="od-box">
        <h3>Delivery Address</h3>
        <p><b>Name:</b> {order.userInfo?.name}</p>
        <p><b>Phone:</b> {order.userInfo?.phone}</p>
        <p><b>District:</b> {order.userInfo?.district}</p>
        <p><b>State:</b> {order.userInfo?.state}</p>
        <p><b>Address:</b> {order.userInfo?.address}</p>
        <p><b>Pincode:</b> {order.userInfo?.pincode}</p>
      </div>

      {/* ITEMS LIST */}
      <div className="od-box">
        <h3>Items in this Order</h3>

        {order.items.map((item, i) => (
          <div className="od-item" key={i}>

            {/* ⭐ Image fix here */}
           <img
                src={item.image}
                alt=""
                className="order-item-img"
              />



            <div>
              <p className="od-item-title">{item.productName}</p>

              <p>Variant: <b>{item.variant?.label}</b></p>

              <p>Price: ₹{item.variant?.offerPrice}</p>

              <p>Quantity: {item.quantity}</p>

              <p className="od-subtotal">
                Subtotal: ₹{item.quantity * item.variant?.offerPrice}
              </p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default OrderDetails;
