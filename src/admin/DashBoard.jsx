import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);

  const navigate = useNavigate();

  // 🔹 ORDERS LISTENER (same as before)
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      setTotalOrders(orders.length);

      setPendingOrders(
        orders.filter(
          (o) => (o.status || "").toLowerCase() === "pending"
        ).length
      );

      const customerIds = new Set();
      orders.forEach((o) => {
        if (o.userId) customerIds.add(o.userId);
      });
      setCustomersCount(customerIds.size);

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 🔹 REVENUE LISTENER (NEW & CORRECT)
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "adminStats", "revenue"),
      (snap) => {
        if (snap.exists()) {
          setRevenue(snap.data().totalRevenue || 0);
        }
      }
    );

    return () => unsub();
  }, []);

  const currency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(value || 0));

  if (loading) return <div className="dash-container">Loading dashboard...</div>;

  return (
    <div className="dash-container">
      <h2 className="dash-title">Dashboard Overview</h2>

      <div className="dash-grid">
        <div
          className="dash-card"
          onClick={() => navigate("/admin/orders")}
          style={{ cursor: "pointer" }}
        >
          <div className="dash-icon icon-blue">🛒</div>
          <div>
            <p className="dash-label">Total Orders</p>
            <h3 className="dash-value">{totalOrders}</h3>
          </div>
        </div>

        <div
          className="dash-card"
          onClick={() => navigate("/admin/orders?filter=pending")}
          style={{ cursor: "pointer" }}
        >
          <div className="dash-icon icon-yellow">⏳</div>
          <div>
            <p className="dash-label">Pending Orders</p>
            <h3 className="dash-value">{pendingOrders}</h3>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-icon icon-green">₹</div>
          <div>
            <p className="dash-label">Revenue</p>
            <h3 className="dash-value">{currency(revenue)}</h3>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-icon icon-red">👥</div>
          <div>
            <p className="dash-label">Customers</p>
            <h3 className="dash-value">{customersCount}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
