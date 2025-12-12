import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";

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

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

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
    "/admin/settings"
  ];

  const hideNavbar = hideNavbarOn.includes(location.pathname);

  //  SECRET ADMIN ACCESS FIX
  useEffect(() => {
    if (location.search.includes("admin")) {
      navigate("/admin/login", { replace: true });
    }
  }, [location, navigate]);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ADMIN LOGIN PAGE */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PROTECTED ADMIN ROUTES */}
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
        </Route>

        {/* USER ROUTES */}
        <Route path="/notifications" element={<Notifications />} />

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
      </Routes>
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
