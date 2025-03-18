import { useContext, useState, useEffect, useRef } from "react";
import { SplineBlob } from "./spline";
import { SplineLoadContext } from "./splineLoadProvider";
import { useNavigate } from "react-router-dom"; // Import this if you're using React Router

export default function Login() {
  const { splineLoaded } = useContext(SplineLoadContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const googleButtonRef = useRef(null);
  const navigate = useNavigate(); // Add this if using React Router

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
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: 380,
        });
      }
    };

    loadGoogleScript();
  }, []);

  const handleGoogleResponse = async (response) => {
    // Send the ID token to your backend
    try {
      const result = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await result.json();

      if (data.success) {
        // Store the user session/token
        localStorage.setItem("token", data.token);

        // Option 1: If using React Router
        navigate("/home"); // Navigate to the home route (lowercase)

        // Option 2: If not using React Router
        // window.location.href = "/home"; // Use absolute path without the dot
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  // Rest of your component remains the same
  return (
    <div className="login-container">
      <div className="spline-background">
        <SplineBlob />
      </div>

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

        <div ref={googleButtonRef} className="google-signin-container"></div>

        <p className="signup-link">
          Don&apos;t have an account? <a href="/signup">Sign up</a>
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
