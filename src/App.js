import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Orders from "./pages/Orders";
import AddVariants from "./auto/AddVariants";
import OrderDetails from "./pages/OrderDetails";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import Verified from "./pages/Verified";
import Profile from "./pages/Profile";
import AddressPage from "./pages/Addresses";

function Layout() {
  const location = useLocation();

  // Pages where Navbar should NOT appear
  const hideNavbarOn = ["/verify", "/login", "/signup", "/forgot", "/reset"];

  const hideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>

        <Route path="/verified" element={<Verified />} />
        <Route path="/reset" element={<Reset />} />
        {/* <Route path="/verify" element={<VerifyAction />} /> */}

        <Route path="/profile" element={<Profile />} />
        <Route path="/addresses" element={<AddressPage />} />

        <Route path="/add-variants" element={<AddVariants />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        <Route path="/" element={<Home />} />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/orders" element={<Orders />} />
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
