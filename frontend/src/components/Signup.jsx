// Login.js
import { useContext, useState, useEffect } from "react";
import { SplineBlob } from "./spline";
import { SplineLoadContext } from "./splineLoadProvider";

export default function Login() {
  const { splineLoaded } = useContext(SplineLoadContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    useEffect(() => {
      // Load the Google Sign-In SDK
      const loadGoogleScript = () => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = initializeGoogleSignIn;
      };

      const initializeGoogleSignIn = () => {
        window.google.accounts.id.initialize({
          client_id:
            "1060221181168-tcqc0u99kb3kbnhjrburithdi5ga8cvo.apps.googleusercontent.com", // Replace with your actual client ID
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInButton"),
          { theme: "outline", size: "large", width: 380 }
        );
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
          // Redirect or update app state
          window.location.href = "/dashboard";
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    };

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
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}
