import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { SplineBlob } from "./spline";
import { SplineLoadContext } from "./splineLoadProvider";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/auth";
import api from "../config/api"

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

  const handleGoogleResponse = useCallback(
    async (response) => {
      setLoading(true);
      setError("");

      try {
        const result = await fetch(api.auth.google, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: response.credential }),
          credentials: "include",
        });

        const data = await result.json();

        if (data.success) {
          login(data.token, data.user);
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
    },
    [navigate]
  );

  useEffect(() => {
    const loadGoogleScript = () => {
      if (
        document.querySelector(
          'script[src="https://accounts.google.com/gsi/client"]'
        )
      ) {
        console.log("Google script already loaded");
        setTimeout(() => initializeGoogleSignIn(), 500);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google script loaded");
        setTimeout(() => initializeGoogleSignIn(), 500);
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  const initializeGoogleSignIn = useCallback(() => {
    if (window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id:
          "1060221181168-tcqc0u99kb3kbnhjrburithdi5ga8cvo.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
      });
      console.log("Google Sign-In button rendered");
    } else {
      console.log("Google Sign-In button could not be rendered");
    }
  }, [handleGoogleResponse]);

  const handleGitHubLogin = () => {
    // Generate a random state parameter for security
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('github_oauth_state', state);
    
    const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${api.auth.githubClientId}&redirect_uri=${window.location.origin}/signup&scope=user:email&state=${state}`;
    localStorage.setItem("preAuthPath", window.location.pathname);
    window.location.href = githubOAuthUrl;
  };

  // Updated useEffect to handle GitHub OAuth callback
  useEffect(() => {
    const handleGitHubCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      const savedState = localStorage.getItem('github_oauth_state');

      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);

      if (code && state && state === savedState) {
        setLoading(true);
        setError("");

        try {
          const result = await fetch(api.auth.github, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, state }),
            credentials: "include",
          });

          if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
          }

          const data = await result.json();

          if (data.success) {
            login(data.token, data.user);
            const prePath = localStorage.getItem("preAuthPath") || "/home";
            localStorage.removeItem("preAuthPath");
            localStorage.removeItem('github_oauth_state');
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
      } else if (code && (!state || !savedState || state !== savedState)) {
        setError("Invalid OAuth state. Please try again.");
      }
    };

    handleGitHubCallback();
  }, [navigate]);

  const validatePassword = (password) => {
    // Check for minimum length
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    // Additional password strength checks could be added here
    // For example, requiring uppercase, lowercase, numbers, etc.

    return ""; // Empty string means valid
  };

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

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const result = await fetch(api.auth.signup, {
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
        // Use the same login function as social logins for consistency
        login(data.token, data.user);

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
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
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
          Sign up with GitHub
        </button>
        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
