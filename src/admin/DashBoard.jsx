import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
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

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      setTotalOrders(orders.length);

      setPendingOrders(
        orders.filter((o) => (o.status || "").toLowerCase() === "pending").length
      );

      const rev = orders.reduce((sum, o) => {
        if (typeof o.totalAmount === "number") return sum + o.totalAmount;
        if (typeof o.total === "number") return sum + o.total;

        if (Array.isArray(o.items)) {
          return (
            sum +
            o.items.reduce((s, it) => {
              const price = Number(it.variant?.offerPrice ?? it.price ?? 0);
              const qty = Number(it.quantity ?? 1);
              return s + price * qty;
            }, 0)
          );
        }

        return sum;
      }, 0);

      setRevenue(rev);

      const customerIds = new Set();
      orders.forEach((o) => {
        if (o.userId) customerIds.add(o.userId);
      });
      setCustomersCount(customerIds.size);

      setLoading(false);
    });

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
        <div className="dash-card" onClick={() => navigate("/admin/orders")} style={{ cursor: "pointer" }}>
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
