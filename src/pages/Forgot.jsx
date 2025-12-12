import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import "../Auth.css";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); 

  const handleReset = async () => {
    if (!email.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email, {
        url: "http://tizell.com/reset",
      });

      alert("If this email exists, a reset link has been sent.");
      navigate("/login");   

    } catch (error) {
      console.log("Reset error:", error.code);

      // Even on error
      alert("If this email exists, a reset link has been sent.");
      navigate("/login");   
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Reset Password 🔐</h2>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleReset} className="auth-btn">
          Send Reset Link
        </button>

        <p className="switch-text">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Forgot;
