import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Admin.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin"); 
    navigate("/admin/login");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-title">Tizell Admin</h2>

        <Link to="/admin/dashboard" className="admin-link">Dashboard</Link>
        <Link to="/admin/orders" className="admin-link">Orders</Link>
        <Link to="/admin/customers" className="admin-link">Customers</Link>

        <button className="admin-logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
