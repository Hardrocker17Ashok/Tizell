import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  // Check admin login from localStorage
  const admin = localStorage.getItem("admin");

  // If not logged in, redirect to admin login page
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Allow access
  return children;
}
