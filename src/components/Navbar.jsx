import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { FaBars } from "react-icons/fa";

import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  const [unread, setUnread] = useState(0);

  const profileRef = useRef(null);

  // ---------------- NOTIFICATION LISTENER ----------------
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", auth.currentUser.uid),
      where("read", "==", false)
    );

    const unsub = onSnapshot(q, (snap) => {
      setUnread(snap.size);
    });

    return () => unsub();
  }, []);

  // ---------------- AUTH LISTENER ----------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setCartCount(0);
    });

    return () => unsub();
  }, []);

  // ---------------- CART LISTENER ----------------
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "cart"), where("userId", "==", user.uid));

    const unsub = onSnapshot(q, (snap) => {
      let total = 0;
      snap.docs.forEach((doc) => {
        const data = doc.data();
        total += data.quantity || 1;
      });
      setCartCount(total);
    });

    return () => unsub();
  }, [user]);

  // ---------------- CLOSE PROFILE IF CLICKED OUTSIDE ----------------
  useEffect(() => {
    const closeMenu = (e) => {
      if (!profileOpen) return;
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [profileOpen]);

  // ---------------- LOGOUT ----------------
  const logoutHandler = async () => {
    await signOut(auth);
    setCartCount(0);
    setProfileOpen(false);
    navigate("/");
  };

return (
  <nav className="pro-navbar">

    {/* LEFT LOGO */}
    <div className="nav-left" onClick={() => navigate("/")}>
      <h1 className="brand">Tizell</h1>
    </div>

    {/* RIGHT SIDE MENU */}
    <div className="nav-right">

      <span className="nav-item" onClick={() => navigate("/")}>Home</span>

      {user && (
        <span className="nav-item" onClick={() => navigate("/orders")}>
          Orders
        </span>
      )}

      {user && (
        <div className="nav-icon-box" onClick={() => navigate("/notifications")}>
          <span className="icon">🔔</span>
          {unread > 0 && <span className="icon-badge">{unread}</span>}
        </div>
      )}

      <div className="nav-icon-box" onClick={() => navigate("/cart")}>
        <span className="icon">🛒</span>
        {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
      </div>

      {/* LOGIN / PROFILE */}
      {!user ? (
        <button className="login-button" onClick={() => navigate("/login")}>
          Login
        </button>
      ) : (
        <div className="profile-wrapper" ref={profileRef}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            className="profile-avatar"
            onClick={(e) => {
              e.stopPropagation();
              setProfileOpen(!profileOpen);
            }}
          />

          {profileOpen && (
            <div className="profile-menu" onClick={(e) => e.stopPropagation()}>
              <p className="menu-header">Hello, {user.displayName || "User"}</p>
              <hr />
              <button onClick={() => navigate("/profile")}>My Profile</button>
              <button onClick={() => navigate("/orders")}>My Orders</button>
              <button onClick={() => navigate("/notifications")}>Notifications</button>
              <button className="logout" onClick={logoutHandler}>Logout</button>
            </div>
          )}
        </div>
      )}

      {/* MOBILE BURGER */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <FaBars />
      </div>

    </div>

    {/* MOBILE MENU */}
    <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
      <Link to="/">Home</Link>
      {user && <Link to="/orders">Orders</Link>}
      {user && <Link to="/notifications">Notifications</Link>}
      <Link to="/cart">Cart</Link>
      {!user && <Link to="/login">Login</Link>}
    </div>
  </nav>
);





};

export default Navbar;
