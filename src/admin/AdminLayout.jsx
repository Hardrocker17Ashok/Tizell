import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Admin.css";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="admin-layout">

      {/* MOBILE TOGGLE BUTTON */}
      <button className="admin-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
        <h2 className="admin-title">Tizell Admin</h2>

        <Link to="/admin/dashboard" className="admin-link">Dashboard</Link>
        <Link to="/admin/notifications" className="admin-link">🔔 Notifications</Link>
        <Link to="/admin/orders" className="admin-link">Orders</Link>
        <Link to="/admin/customers" className="admin-link">Customers</Link>

        <button className="admin-logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
