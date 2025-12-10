import { useState, useEffect } from "react";
import {
  confirmPasswordReset,
  verifyPasswordResetCode,
  getAuth
} from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../Auth.css";

const Reset = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("checking");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const oobCode = params.get("oobCode");

  // Validate reset link
  useEffect(() => {
    if (!oobCode) {
      setStatus("error");
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        setEmail(email);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const handleReset = async () => {
    if (newPass !== confirmPass) {
      alert("Passwords do not match.");
      return;
    }

    if (newPass.length < 6) {
      alert("Password should be at least 6 characters.");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPass);

      // Firebase has updated password in DB
      setStatus("success");

      setTimeout(() => navigate("/login"), 2000);

    } catch (error) {
      console.log(error);
      alert("Password reset failed.");
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-box">

        {status === "checking" && (
          <>
            <div className="loader"></div>
            <h2>Validating reset link...</h2>
          </>
        )}

        {status === "error" && (
          <>
            <h2>Invalid or Expired Link ❌</h2>
            <button className="auth-btn" onClick={() => navigate("/forgot")}>
              Request new reset link
            </button>
          </>
        )}

        {status === "ready" && (
          <>
            <h2>Create New Password 🔐</h2>
            <p>Resetting account for: <strong>{email}</strong></p>

            <div className="password-field">
              <input
                type="password"
                className="styled-input"
                placeholder="New Password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
            </div>

            <div className="password-field">
              <input
                type="password"
                className="styled-input"
                placeholder="Confirm Password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
            </div>


            <button className="auth-btn" onClick={handleReset}>
              Change Password
            </button>
          </>
        )}

        {status === "success" && (
          <>
            <img
              src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
              alt="success"
              className="verify-icon"
            />
            <h2>Password Updated Successfully 🎉</h2>
            <p>Redirecting...</p>
          </>
        )}

      </div>
    </div>
  );
};

export default Reset;
