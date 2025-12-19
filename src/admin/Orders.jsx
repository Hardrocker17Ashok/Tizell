import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, addDoc, increment, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useLocation } from "react-router-dom";
import "./Admin.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const location = useLocation();

  const filter = new URLSearchParams(location.search).get("filter");

  const loadOrders = async () => {
    const snap = await getDocs(collection(db, "orders"));
    let list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (filter === "pending") {
      list = list.filter((o) => (o.status || "").toLowerCase() === "pending");
    }

    setOrders(list);
  };

  // ------------------------------------------------------------
  // 🔔 PROFESSIONAL NOTIFICATION GENERATOR
  // ------------------------------------------------------------
  const notificationMessage = (order, status) => {
    const item = order.items[0];

    const templates = {
      "Shipped": `
📦 Your Order is Shipped!

We're excited to let you know that your package is now on the way.  
Here are your order details:

• Product: ${item.productName}  
• Variant: ${item.variant?.label || "Default"}  
• Quantity: ${item.quantity}  

Thank you for choosing Tizell! 😊
      `,

      "Out for Delivery": `
🚚 Your Order is Out for Delivery!

Your package is about to reach your doorstep.  
Keep your phone available for delivery updates.

• Product: ${item.productName}  
• Quantity: ${item.quantity}

We appreciate your trust in Tizell ❤️
      `,

      "Delivered": `
🎉 Order Delivered Successfully!

We hope you enjoy your purchase.

• Product: ${item.productName}  
• Variant: ${item.variant?.label || "Default"}

Thanks for shopping with Tizell. You're awesome! 💛
      `,

      "Cancelled": `
⚠️ Your Order Has Been Cancelled

If this was a mistake or you need help, feel free to contact support.

• Product: ${item.productName}  
• Quantity: ${item.quantity}

We're always here to help ❤️
      `
    };

    return templates[status] || "Your order has been updated.";
  };

  // ------------------------------------------------------------
  // UPDATE STATUS + NOTIFICATION
  // ------------------------------------------------------------
  const updateStatus = async (id, status, userId) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    // 1️⃣ Update order status
    await updateDoc(doc(db, "orders", id), { status });

    // 2️⃣ ✅ Revenue ONLY when Delivered
    if (status === "Delivered") {
      await setDoc(
        doc(db, "adminStats", "revenue"),
        {
          totalRevenue: increment(order.total)
        },
        { merge: true }
      );
    }

    // 3️⃣ Send notification
    await addDoc(collection(db, "notifications"), {
      userId,
      orderId: id,
      status,
      title: `Order ${status}`,
      message: notificationMessage(order, status),
      createdAt: Date.now(),
      read: false,
    });

    alert("Status updated successfully");
    loadOrders();
  };



  // ---------------------------------------------------------
  //  PRINT INVOICE + AUTO SHIPPED NOTIFICATION
  // ---------------------------------------------------------
  const handlePrint = async (order) => {
    const win = window.open("", "PRINT", "height=650,width=900");

    win.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>

          <style>
            body { font-family: Arial; padding: 20px; }
            .header { display: flex; justify-content: space-between; }
            .logo { font-size: 26px; font-weight: bold; color: #ff9900; }
            .section { margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 10px; }
            th { background: #f2f2f2; }
            h2 { margin-top: 20px; }
          </style>
        </head>

        <body>

          <div class="header">
            <div class="logo">Tizell.com</div>
            <div>
              <p><b>Order ID:</b> ${order.id}</p>
              <p><b>Date:</b> ${new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <hr />

          <div class="section">
            <h3>Customer Details</h3>
            <p><b>Name:</b> ${order.address?.name}</p>
            <p><b>Phone:</b> ${order.address?.phone}</p>
          </div>

          <div class="section">
            <h3>Delivery Address</h3>
            <p>${order.address?.address}</p>
            <p>${order.address?.district}, ${order.address?.state}</p>
            <p>Pincode: ${order.address?.pincode}</p>
          </div>

          <div class="section">
            <h3>Payment Information</h3>
            <p><b>Payment Mode:</b> ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</p>
          </div>

          <div class="section">
            <h3>Items (${order.items.length})</h3>
            <table>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>

              ${order.items
        .map(
          (item) => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.variant?.label || "-"}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.variant?.offerPrice || item.price}</td>
                </tr>`
        )
        .join("")}
            </table>
          </div>

          <h2>Subtotal: ₹${order.total - (order.deliveryCharge || 0)}</h2>

<h3>Delivery Charge: ${order.deliveryCharge > 0 ? "₹" + order.deliveryCharge : "FREE"
      }</h3>

<h2>Total Amount: ₹${order.total}</h2>


          <p style="text-align:center; margin-top:20px;">
            Thank you for shopping with <b>Tizell</b>.
          </p>

        </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
    win.close();

    // Auto-Mark Shipped
    await updateDoc(doc(db, "orders", order.id), { status: "Shipped" });

    // Notification for shipped
    await addDoc(collection(db, "notifications"), {
      userId: order.userId,
      title: "Order Shipped 🚚",
      message: notificationMessage(order, "Shipped"),
      read: false,
      createdAt: Date.now(),
    });

    loadOrders();
    alert("Invoice printed & order marked as Shipped!");
  };

  useEffect(() => {
    loadOrders();
  }, [filter]);

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <div className="admin-orders-container">
      <h2 className="admin-title">
        {filter === "pending" ? "⏳ Pending Orders" : "📦 All Orders"}
      </h2>

      {orders.length === 0 && <p className="no-orders">No orders found</p>}

      {orders.map((order) => (
        <div key={order.id} className="admin-order-card">

          {/* HEADER */}
          <div className="admin-order-header">
            <div>
              <h4>Order ID: {order.id}</h4>
              <p className="order-date">{new Date(order.createdAt).toLocaleString()}</p>

              <p><b>Payment:</b> {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</p>
              <p><b>Status:</b> {order.paymentStatus}</p>
            </div>

            <div className="order-status-box">
              <span className={`status-badge ${order.status?.toLowerCase()}`}>{order.status}</span>
            </div>
          </div>

          {/* CUSTOMER */}
          <div className="order-section">
            <h4>Customer Details</h4>
            <p><b>Name:</b> {order.address?.name}</p>
            <p><b>Phone:</b> {order.address?.phone}</p>
          </div>

          {/* ADDRESS */}
          <div className="order-section">
            <h4>Delivery Address</h4>
            <p>{order.address?.address}</p>
            <p>{order.address?.district}, {order.address?.state}</p>
            <p>Pincode: {order.address?.pincode}</p>
          </div>

          {/* ITEMS */}
          <div className="order-section">
            <h4>Items ({order.items.length})</h4>
            {order.items.map((item, i) => (
              <p key={i}>• {item.productName} ({item.quantity} × ₹{item.variant?.offerPrice})</p>
            ))}
          </div>

          {/* FOOTER */}
          <div className="admin-order-footer">

            <button className="btn print" onClick={() => handlePrint(order)}>
              🖨️ Print Invoice
            </button>

            <h3 className="order-amount">
              Total: ₹{order.total}
              {order.deliveryCharge > 0 && (
                <span style={{ color: "red", fontSize: "14px" }}>
                  {" "} +₹{order.deliveryCharge} Delivery Charge
                </span>
              )}
            </h3>


            <div className="status-buttons">

              <button className="btn shipped" onClick={() => updateStatus(order.id, "Shipped", order.userId)}>
                Mark Shipped
              </button>

              <button className="btn out-for-delivery" onClick={() => updateStatus(order.id, "Out for Delivery", order.userId)}>
                Out for Delivery
              </button>

              <button className="btn delivered" onClick={() => updateStatus(order.id, "Delivered", order.userId)}>
                Mark Delivered
              </button>

              <button className="btn cancelled" onClick={() => updateStatus(order.id, "Cancelled", order.userId)}>
                Cancel Order
              </button>

            </div>
          </div>

        </div>
      ))}
    </div>
  );
}
