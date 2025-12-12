import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from "firebase/auth";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import "../Auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // Strong password rule (letters + numbers only, min 6 chars)
  const strongPassword = (pwd) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(pwd);
  };

  const handleSignup = async () => {
    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    if (!strongPassword(password)) {
      alert(
        "Password must be at least 6 characters long and include both letters and numbers."
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      //  Save Name in Firebase Auth
      await updateProfile(userCredential.user, {
        displayName: name,
      });


      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name,
        email: email,
        createdAt: Date.now(),
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      alert("Verification link sent! Check your email.");
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Email already in use. Please log in or verify your email.");
      navigate("/login");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account ✨</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-wrapper">
          <input
            type={showPassword1 ? "text" : "password"}
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword1(!showPassword1)}
          >
            {showPassword1 ? "🙈" : "👁️"}
          </span>
        </div>

        <div className="password-wrapper">
          <input
            type={showPassword2 ? "text" : "password"}
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword2(!showPassword2)}
          >
            {showPassword2 ? "🙈" : "👁️"}
          </span>
        </div>

        <button onClick={handleSignup} className="auth-btn">
          Sign Up
        </button>

        <p className="switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
