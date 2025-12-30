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

  const mobileMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  // CLOSE MOBILE MENU
  useEffect(() => {
    const handler = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // CLOSE PROFILE MENU
  useEffect(() => {
    const closeProfile = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", closeProfile);
    return () => document.removeEventListener("click", closeProfile);
  }, []);

  //  AUTH LISTENER (UNCHANGED)
  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setCartCount(0);
    });
  }, []);

  //  FIXED NOTIFICATION LISTENER
  useEffect(() => {
    if (!user) {
      setUnread(0);
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      where("read", "==", false)
    );

    const unsub = onSnapshot(q, (snap) => {
      setUnread(snap.size);
    });

    return () => unsub();
  }, [user]); 

  // CART LISTENER
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "cart"), where("userId", "==", user.uid));

    return onSnapshot(q, (snap) => {
      let total = 0;
      snap.docs.forEach((doc) => (total += doc.data().quantity || 1));
      setCartCount(total);
    });
  }, [user]);

  // LOGOUT
  const logoutHandler = async () => {
    await signOut(auth);
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="pro-navbar">

      <div className="nav-left" onClick={() => navigate("/")}>
        <h1 className="brand">Tizell</h1>
      </div>

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

        {!user ? (
          <button className="login-button" onClick={() => navigate("/login")}>
            Login
          </button>
        ) : (
          <div className="profile-wrapper" ref={profileMenuRef}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              className="profile-avatar"
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen(!profileOpen);
              }}
            />

            {profileOpen && (
              <div className="desktop-dropdown">
                <button onClick={() => navigate("/profile")}>👤 My Profile</button>
                <button onClick={() => navigate("/orders")}>📦 My Orders</button>
                <button onClick={() => navigate("/notifications")}>🔔 Notifications</button>
                <button className="logout" onClick={logoutHandler}>Logout</button>
              </div>
            )}
          </div>
        )}

        <div
          className="hamburger"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
            setProfileOpen(false);
          }}
        >
          <FaBars />
        </div>
      </div>

      <div
        ref={mobileMenuRef}
        className={`mobile-dropdown ${menuOpen ? "open" : ""}`}
      >
        <button onClick={() => { navigate("/"); setMenuOpen(false); }}>🏠 Home</button>

        {user && (
          <button onClick={() => { navigate("/orders"); setMenuOpen(false); }}>
            📦 My Orders
          </button>
        )}

        {user && (
          <button onClick={() => { navigate("/notifications"); setMenuOpen(false); }}>
            🔔 Notifications {unread > 0 && `(${unread})`}
          </button>
        )}

        <button onClick={() => { navigate("/cart"); setMenuOpen(false); }}>
          🛒 Cart {cartCount > 0 && `(${cartCount})`}
        </button>

        {!user ? (
          <button onClick={() => { navigate("/login"); setMenuOpen(false); }}>
            Login
          </button>
        ) : (
          <>
            <button onClick={() => { navigate("/profile"); setMenuOpen(false); }}>
              👤 Profile
            </button>
            <button className="logout" onClick={logoutHandler}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
