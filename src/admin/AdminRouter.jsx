import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminLayout from "./AdminLayout";
import Orders from "./Orders";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

export default function AdminRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>
        }>
          <Route index element={<div>Dashboard (build later)</div>} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<div>Products CRUD (to build)</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
