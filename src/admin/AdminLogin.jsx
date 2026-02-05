import { useState } from "react";
import { db } from "../firebase";
import { doc, getDocs, collection, query, where } from "firebase/firestore";
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
    const q = query(
      collection(db, "admins"),
      where("email", "==", email.trim())
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Admin not found!");
      return;
    }

    const adminDoc = querySnapshot.docs[0];
    const data = adminDoc.data();

    if (String(data.password) !== String(password)) {
      alert("Incorrect password!");
      return;
    }

    if (data.role !== "admin") {
      alert("Not authorized!");
      return;
    }

    localStorage.setItem(
      "admin",
      JSON.stringify({ id: adminDoc.id, ...data })
    );

    navigate("/admin/dashboard");

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    alert(err.message);
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
