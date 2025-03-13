// Login.js
import { useContext, useState } from "react";
import { SplineBlob } from "./spline";
import { SplineLoadContext } from "./splineLoadProvider";

export default function Login() {
  const { splineLoaded } = useContext(SplineLoadContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-container">
      <div className="spline-background">
        {/* Always render SplineBlob, but it might be hidden until loaded */}
        <SplineBlob />
      </div>

      {/* Login form shows immediately, with proper transitions when spline loads */}
      <div
        className={`login-form ${splineLoaded ? "with-background" : "loading"}`}
      >
        <h2>Login</h2>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-button">Login</button>

        <div className="separator">or</div>

        <button className="signUpWithGoogle">
          <span className="icon">G</span>
          Sign in with Google
        </button>

        <p className="signup-link">
          Don&apos;t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>

      {!splineLoaded && (
        <div className="loading-overlay">
          <div className="loader">Loading...</div>
        </div>
      )}
    </div>
  );
}
