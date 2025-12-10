import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Get user details
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user.displayName || "User",
          email: user.email,
        });
      } else {
        navigate("/login");
      }
    });

    return () => unsub();
  }, [navigate]);

  const handleLogout = () => {
    signOut(auth);
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>

      {/* User Details Box */}
      <div className="profile-box">
        <div className="avatar">
          <span>👤</span>
        </div>

        <div className="profile-info">
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
        </div>
      </div>

      {/* Help Center */}
      <div className="profile-box">
        <h3>Help Center</h3>
        <p><b>Customer Support:</b> +91 8829978572</p>
        <p><b>Email:</b> team@tizell.com</p>
        <p><b>Working Hours:</b> 9 AM – 7 PM (Mon–Sat)</p>
      </div>

      {/* Settings */}
      <div className="profile-box">
        <h3>Quick Links</h3>
        <button className="profile-btn" onClick={() => navigate("/orders")}>
          📦 My Orders
        </button>

        <button className="profile-btn" onClick={() => navigate("/cart")}>
          🛒 My Cart
        </button>

        <button className="profile-btn" onClick={() => navigate("/addresses")}>
          📍 Saved Addresses
        </button>
      </div>

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
