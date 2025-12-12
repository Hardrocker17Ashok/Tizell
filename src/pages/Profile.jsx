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

    {/* HEADER */}
    <div className="profile-header">
      <div className="avatar-large">👤</div>
      <div>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    </div>

    {/* ACCOUNT CARDS */}
    <div className="profile-sections">

      {/* Account Settings */}
      <div className="profile-card">
        <h3>Account Settings</h3>

        <div className="profile-item" onClick={() => navigate("/orders")}>
          <span className="icon">📦</span> My Orders
        </div>

        <div className="profile-item" onClick={() => navigate("/addresses")}>
          <span className="icon">📍</span> Saved Addresses
        </div>

        <div className="profile-item" onClick={() => navigate("/cart")}>
          <span className="icon">🛒</span> My Cart
        </div>
      </div>

      {/* Support */}
      <div className="profile-card">
        <h3>Help & Support</h3>

        <div className="profile-support">
          <p><b>Customer Support:</b> +91 8829978572</p>
          <p><b>Email:</b> team@tizell.com</p>
          <p><b>Working Hours:</b> 9 AM – 7 PM (Mon–Sat)</p>
        </div>
      </div>

      {/* Logout */}
      <div className="profile-card logout-card" onClick={handleLogout}>
        <span className="icon-red">🚪</span>
        <p className="logout-text">Logout</p>
      </div>

    </div>
  </div>
);

};

export default Profile;
