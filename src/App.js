import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate
} from "react-router-dom";

import { useLayoutEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// USER PAGES
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserOrders from "./pages/Orders";
import AddVariants from "./auto/AddVariants";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import Verified from "./pages/Verified";
import Profile from "./pages/Profile";
import AddressPage from "./pages/Addresses";
import Notifications from "./pages/Notifications";

// ADMIN PAGES
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute";
import DashBoard from "./admin/DashBoard";
import AdminOrders from "./admin/Orders";
import Customers from "./admin/Customers";
import AdminNotifications from "./admin/AdminNotifications";

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ ONLY ONE SCROLL LOGIC (GLOBAL & SAFE)
  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  const hideNavbarOn = [
    "/verify",
    "/login",
    "/signup",
    "/forgot",
    "/reset",
    "/admin/login",
    "/admin/dashboard",
    "/admin/orders",
    "/admin/customers",
    "/admin/settings",
    "/admin/notifications"
  ];

  const hideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="notifications" element={<AdminNotifications />} />
        </Route>

        {/* USER */}
        <Route path="/" element={<Home />} />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/verified" element={<Verified />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addresses" element={<AddressPage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/add-variants" element={<AddVariants />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
