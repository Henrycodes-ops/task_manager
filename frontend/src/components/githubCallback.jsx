import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../config/api";
import { login } from "../utils/auth";

function GitHubCallback() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleGitHubCallback = async () => {
      // Get code from URL
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");

      if (!code) {
        setError("GitHub authentication failed. No code received.");
        setLoading(false);
        return;
      }

      try {
        // Send the code to your backend
        const response = await fetch(api.auth.github, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
          credentials: "include",
        });

        const data = await response.json();

        if (data.success) {
          // Store the user session/token
          login(data.token, data.user);

          // Navigate to home
          navigate("/home");
        } else {
          setError(data.message || "GitHub authentication failed");
          setLoading(false);
        }
      } catch (error) {
        console.error("GitHub authentication error:", error);
        setError(
          "Server error during GitHub authentication. Please try again later."
        );
        setLoading(false);
      }
    };

    handleGitHubCallback();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="github-callback-container">
        <div className="loader"></div>
        <p>Completing GitHub sign-in...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="github-callback-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate("/login")}>Back to Login</button>
      </div>
    );
  }

  return null;
}

export default GitHubCallback;
