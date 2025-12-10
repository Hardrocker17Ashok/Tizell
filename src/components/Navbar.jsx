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

  const profileRef = useRef(null);

  // ------------------ AUTH LISTENER ------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setCartCount(0);
    });

    return () => unsub();
  }, []);

  // ------------------ CART COUNT LISTENER ------------------
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

  // ------------------ FIXED CLICK OUTSIDE MENU ------------------
  useEffect(() => {
    const closeMenu = (e) => {
      // If menu is closed → no need to check
      if (!profileOpen) return;

      // If clicked outside profile wrapper → close menu
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [profileOpen]);

  // ------------------ LOGOUT ------------------
  const logoutHandler = async () => {
    await signOut(auth);
    setCartCount(0);
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <nav className="nav-container">
      
      {/* LOGO */}
      <div className="nav-logo">
        <Link to="/">Tizell</Link>
      </div>

      {/* NAVIGATION LINKS */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/">Home</Link></li>
        {user && <li><Link to="/orders">Orders</Link></li>}
        <li><Link to="/cart">Cart ({cartCount})</Link></li>

        {/* LOGIN / PROFILE */}
        {!user ? (
          <li><Link to="/login" className="login-btn">Login</Link></li>
        ) : (
          <li className="profile-wrapper" ref={profileRef}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              className="profile-img"
              alt="profile"
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen((prev) => !prev);
              }}
            />

            {profileOpen && (
              <div className="profile-menu" onClick={(e) => e.stopPropagation()}>
                <Link to="/profile">My Profile</Link>
                <Link to="/orders">My Orders</Link>
                <button className="logout-btn" onClick={logoutHandler}>
                  Logout
                </button>
              </div>
            )}
          </li>
        )}
      </ul>

      {/* MOBILE BURGER MENU */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <FaBars />
      </div>
    </nav>
  );
};

export default Navbar;
