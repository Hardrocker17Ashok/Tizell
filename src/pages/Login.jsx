import { useState } from "react";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import "../Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [unverifiedUser, setUnverifiedUser] = useState(null);

  // Show/Hide password
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // If email is not verified
      if (!userCredential.user.emailVerified) {
        setUnverifiedUser(userCredential.user);
        return; // DO NOT login
      }

      // If verified → allow login
      navigate("/");

    } catch (error) {
      console.log(error);
      alert("Invalid email or password");
    }
  };

  // SEND VERIFICATION EMAIL AGAIN
  const resendVerification = async () => {
    if (!unverifiedUser) return;

    await sendEmailVerification(unverifiedUser);
    alert("Verification link sent again! Please check your email.");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Login to continue shopping</p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD FIELD WITH SHOW/HIDE */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button onClick={handleLogin} className="auth-btn">
          Login
        </button>

        {/* PROFESSIONAL RESEND VERIFICATION BOX */}
        {unverifiedUser && (
          <div className="verify-warning-box">
            <p>Your email is not verified.</p>
            <button className="small-btn" onClick={resendVerification}>
              Resend Verification Link
            </button>
          </div>
        )}

        <p className="switch-text">
          <Link to="/forgot">Forgot Password?</Link>
        </p>

        <p className="switch-text">
          New user? <Link to="/signup">Create an account</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
