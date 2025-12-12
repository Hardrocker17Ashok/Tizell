import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function OrderDetails({ order, onClose }) {
  if (!order) return null;

  const updateStatus = async (status) => {
    await setDoc(doc(db, "orders", order.id), { ...order, status }, { merge: true });
    alert("Status updated");
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }}>
      <div style={{ background:"#fff", width:800, padding:20, borderRadius:8 }}>
        <button onClick={onClose} style={{ float:"right" }}>Close</button>
        <h3>Order #{order.id}</h3>
        <div><strong>Customer:</strong> {order.customer?.name} • {order.customer?.phone}</div>
        <div><strong>Address:</strong> {order.address?.address}, {order.address?.district}, {order.address?.state} - {order.address?.pincode}</div>
        <hr />
        <h4>Items</h4>
        <ul>{(order.items || []).map((it, idx) => <li key={idx}>{it.name} x {it.quantity} — ₹{it.price}</li>)}</ul>
        <div><strong>Total:</strong> ₹{order.totalAmount}</div>
        <div style={{ marginTop:12, display:"flex", gap:8 }}>
          <button onClick={() => updateStatus("Packed")}>Packed</button>
          <button onClick={() => updateStatus("Shipped")}>Shipped</button>
          <button onClick={() => updateStatus("Out for Delivery")}>Out for Delivery</button>
          <button onClick={() => updateStatus("Delivered")}>Delivered</button>
          <button onClick={() => updateStatus("Cancelled")}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
