import { useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email & password");
      return;
    }

    try {
      const ref = doc(db, "admins", email);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("Admin not found!");
        return;
      }

      const data = snap.data();

      if (data.password !== password) {
        alert("Incorrect password!");
        return;
      }

      if (data.role !== "admin") {
        alert("Not authorized!");
        return;
      }

      localStorage.setItem("admin", JSON.stringify(data));
      navigate("/admin/dashboard");
    } catch (err) {
      alert("Login error!");
      console.log(err);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">

        <h2 className="admin-title">Admin Login</h2>

        <input
          type="email"
          className="admin-input"
          placeholder="Admin Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="admin-input"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="admin-login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
