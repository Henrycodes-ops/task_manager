import { useContext, useState } from "react";
import { SplineBlob } from "./spline";
import { SplineLoadContext } from "./splineLoadProvider";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { login } from "../utils/auth";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const { splineLoaded } = useContext(SplineLoadContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //  useEffect(() => {
  //    // Set default axios config
  //    axios.defaults.withCredentials = true;
  //  }, []);

  // First, let's test the backend connection
  const testBackendConnection = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/status", {
        withCredentials: true,
      });
      console.log("Backend connection test:", response.data);
      return true;
    } catch (err) {
      console.error("Backend connection failed:", err.message);
      return false;
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      setError("");

      // Test connection first
      const connectionOk = await testBackendConnection();
      if (!connectionOk) {
        throw new Error(
          "Cannot connect to the server. Please make sure the backend is running."
        );
      }

      console.log("Google response:", response);

      const res = await axios.post(
        "http://localhost:3001/api/auth/google",
        { token: response.credential },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data.success) {
        login(res.data.token, res.data.user);
        navigate("/home");
      } else {
        setError(res.data.error || "Authentication failed");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      if (err.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to the server. Please check if the backend is running."
        );
      } else {
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to authenticate with Google"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      // Test connection first
      const connectionOk = await testBackendConnection();
      if (!connectionOk) {
        throw new Error(
          "Cannot connect to the server. Please make sure the backend is running."
        );
      }

      const result = await axios.post(
        "http://localhost:3001/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (result.data.success) {
        login(result.data.token, result.data.user);
        navigate("/home");
      } else {
        setError(result.data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to the server. Please check if the backend is running."
        );
      } else if (error.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(
          error.response?.data?.error ||
            error.message ||
            "Server error. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem("github_oauth_state", state);

    const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=Ov23li0Zf2FMhySKZ9uP&redirect_uri=${encodeURIComponent(
      "http://localhost:5173/signup"
    )}&scope=user:email&state=${state}`;
    localStorage.setItem("preAuthPath", window.location.pathname);
    window.location.href = githubOAuthUrl;
  };

  return (
    <div className="login-container">
      <div className="spline-background">
        <SplineBlob />
      </div>

      <div
        className={`login-form ${splineLoaded ? "with-background" : "loading"}`}
      >
        <h2>Login</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleEmailLogin}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="forgot-password">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <div className="separator">or</div>

        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleResponse}
            onError={() => setError("Google login failed")}
            useOneTap
            theme="outline"
            size="large"
            width="300"
            text="signin_with"
            shape="rectangular"
          />
        </div>

        <button
          onClick={handleGitHubLogin}
          className="github-signin-button"
          disabled={loading}
        >
          Sign in with GitHub
        </button>

        <p className="signup-link">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
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
