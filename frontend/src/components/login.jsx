import { useContext, useState,  } from "react";
import { SplineBlob } from "./spline";
import { SplineLoadContext } from "./splineLoadProvider";
import { useNavigate, Link } from "react-router-dom";
import api from "../config/api";
import { login } from "../utils/auth";
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const { splineLoaded } = useContext(SplineLoadContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      setError("");
      
      const res = await fetch(api.auth.google, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      const data = await res.json();
      if (data.success) {
        login(data.token, data.user);
        navigate('/home');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'Failed to authenticate with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await fetch(api.auth.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await result.json();

      if (data.success) {
        login(data.token, data.user);
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('github_oauth_state', state);
    
    const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${api.auth.githubClientId}&redirect_uri=${encodeURIComponent(api.auth.githubRedirectUri)}&scope=user:email&state=${state}`;
    localStorage.setItem("preAuthPath", window.location.pathname);
    window.location.href = githubOAuthUrl;
  };

  return (
    <div className="login-container">
      <div className="spline-background">
        <SplineBlob />
      </div>

      <div className={`login-form ${splineLoaded ? "with-background" : "loading"}`}>
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
            onError={() => setError('Google login failed')}
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
