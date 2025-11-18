import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // TEMP: no firebase → treat user as "logged out"
  const user = false;

  return (
    <nav className="nav-container">
      {/* LEFT: LOGO */}
      <div className="nav-logo">
        <Link to="/">Tizell</Link>
      </div>

      {/* MIDDLE: NAV LINKS */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/cart">Cart</Link></li>

        {/* TEMP Login / Profile (Fake UI only) */}
        {!user ? (
          <li><Link to="/login" className="login-btn">Login</Link></li>
        ) : (
          <li
            className="profile-wrapper"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              className="profile-img"
              alt="profile"
            />

            {profileOpen && (
              <div className="profile-menu">
                <Link to="/profile">My Profile</Link>
                <Link to="/orders">My Orders</Link>
                <button className="logout-btn">Logout</button>
              </div>
            )}
          </li>
        )}
      </ul>

      {/* RIGHT: HAMBURGER MENU (Mobile) */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <FaBars />
      </div>
    </nav>
  );
};

export default Navbar;
