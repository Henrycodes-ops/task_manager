import { useContext, useState, useEffect, useRef } from "react";
import { SplineBlob } from "./spline";
import { SplineLoadContext } from "./splineLoadProvider";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/auth";

export default function Signup() {
  const { splineLoaded } = useContext(SplineLoadContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const googleButtonRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Load the Google Sign-In SDK
    const loadGoogleScript = () => {
      // Check if the script is already loaded
      if (
        document.querySelector(
          'script[src="https://accounts.google.com/gsi/client"]'
        )
      ) {
        initializeGoogleSignIn();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = initializeGoogleSignIn;
    };

    const initializeGoogleSignIn = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id:
            "1060221181168-tcqc0u99kb3kbnhjrburithdi5ga8cvo.apps.googleusercontent.com",
          callback: handleGoogleResponse,
          allowed_parent_origin: [
            "http://localhost:5173",
            "http://localhost:3001",
            "http://dev.example.com:5173",
            "http://localhost:5173/signup",
          ],
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: 300,
          text: "signup_with",
          shape: "rectangular",
        });
      }
    };

    // window.google.accounts.id.prompt((notification) => {
    //   if (notification.isNotDisplayed()) {
    //     console.log("One Tap not displayed");
    //   }
    // });

    loadGoogleScript();
  }, []);

  const handleGoogleResponse = async (response) => {
    setLoading(true);
    setError("");

    try {
      const result = await fetch("http://localhost:3001/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.credential }),
        credentials: "include",
      });

      const data = await result.json();

      if (data.success) {
        // Store the user session/token
        login(data.token, data.user);

        // Navigate to home
        navigate("/home");
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Add GitHub OAuth login
  const handleGitHubLogin = () => {
    const GITHUB_CLIENT_ID = "Ov23liXr1PjkF9aUE4zq"; // Replace with your GitHub Client ID
    const REDIRECT_URI = "http://localhost:5173/signup"; // Your frontend signup page URL
    const SCOPE = "user:email"; // Request user email permission

    const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;

    // Store the current path to redirect back after GitHub auth
    localStorage.setItem("preAuthPath", window.location.pathname);

    // Redirect to GitHub OAuth
    window.location.href = githubOAuthUrl;
  };

  // New useEffect to handle GitHub OAuth callback
  useEffect(() => {
    const handleGitHubCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        setLoading(true);
        setError("");

        try {
          const result = await fetch("http://localhost:3001/api/auth/github", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
            credentials: "include",
          });

          const data = await result.json();

          if (data.success) {
            // Store the user session/token
            login(data.token, data.user);

            // Retrieve and redirect to the pre-auth path or default to home
            const prePath = localStorage.getItem("preAuthPath") || "/home";
            localStorage.removeItem("preAuthPath");

            navigate(prePath);
          } else {
            setError(data.message || "GitHub authentication failed");
          }
        } catch (error) {
          console.error("GitHub authentication error:", error);
          setError("Server error. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    handleGitHubCallback();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const result = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
      });

      const data = await result.json();

      if (data.success) {
        // Store the user session/token
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Navigate to home
        navigate("/home");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="spline-background">
        <SplineBlob />
      </div>

      <div
        className={`signup-form ${
          splineLoaded ? "with-background" : "loading"
        }`}
      >
        <h2>Create an Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <div className="separator">or</div>
        <div ref={googleButtonRef} className="google-signin-container"></div>
        <button
          onClick={handleGitHubLogin}
          className="github-signin-button"
          disabled={loading}
        >
          Sign up with GitHub Account
        </button>
        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
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
