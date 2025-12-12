import { useEffect, useState } from "react";
import {
  applyActionCode,
  checkActionCode,
  verifyPasswordResetCode
} from "firebase/auth";

import { auth } from "../firebase";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../Auth.css";

const VerifyAction = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const mode = params.get("mode");
    const oobCode = params.get("oobCode");

    if (!mode || !oobCode) {
      setStatus("error");
      setMessage("Missing link parameters.");
      return;
    }

    // -------- VERIFY EMAIL --------
    if (mode === "verifyEmail") {
      checkActionCode(auth, oobCode)
        .then(() => applyActionCode(auth, oobCode))
        .then(() => {
          setStatus("success");
          setMessage("Your email has been verified!");
        })
        .catch((err) => {
          console.error("verifyEmail error:", err);
          setStatus("error");
          setMessage(err.code || "Invalid or expired verification link.");
        });
      return;
    }

    // -------- RESET PASSWORD --------
    if (mode === "resetPassword") {
      verifyPasswordResetCode(auth, oobCode)
        .then(() => {
          navigate(`/reset?oobCode=${oobCode}`, { replace: true });
        })
        .catch((err) => {
          console.error("reset error:", err);
          setStatus("error");
          setMessage(err.code || "Invalid or expired password reset link.");
        });
      return;
    }

    setStatus("error");
    setMessage("Unsupported action type.");
  }, [params, navigate]);

  return (
    <div className="verify-container">
      <div className="verify-box">

        {status === "checking" && (
          <>
            <div className="loader"></div>
            <h2>Processing link…</h2>
          </>
        )}

        {status === "success" && (
          <>
            <h2>Email Verified 🎉</h2>
            <p>{message}</p>
            <button className="auth-btn" onClick={() => navigate("/login")}>
              Continue to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h2>Invalid or Expired Link ❌</h2>
            <p style={{ color: "red" }}>{message}</p>
            <button className="auth-btn" onClick={() => navigate("/login")}>
              Go to Login
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyAction;
