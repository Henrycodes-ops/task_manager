import { useState } from "react";
import { Link } from "react-router-dom";
import { SplineBlob } from "./spline";
import { SplineLoadContext } from "./splineLoadProvider";
import { useContext } from "react";
import api from "../config/api";
import "../components/css/forgotPassword.css";

export default function ForgotPassword() {
  const { splineLoaded } = useContext(SplineLoadContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Basic email validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(api.auth.forgotPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="spline-background">
        <SplineBlob />
      </div>

      <div
        className={`forgot-password-form ${
          splineLoaded ? "with-background" : "loading"
        }`}
      >
        <h2>Reset Password</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            Password reset instructions have been sent to your email.
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="reset-button" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="success-actions">
            <Link to="/login" className="back-to-login">
              Back to Login
            </Link>
          </div>
        )}

        <p className="login-link">
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>

      {!splineLoaded && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
} 