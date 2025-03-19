import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SplineBlob } from "./spline";
import { SplineLoadContext } from "./splineLoadProvider";
import { fetchWithAuth } from "../utils/api";
import api from "../config/api";
import '../app.css'

export default function Home() {
  const { splineLoaded } = useContext(SplineLoadContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const data = await fetchWithAuth(api.users.profile);
      if (data.success) {
        setUserProfile(data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      // Redirect to login if not logged in
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="spline-background">
        <SplineBlob />
      </div>

      <div
        className={`home-content ${
          splineLoaded ? "with-background" : "loading"
        }`}
      >
        <h1>Welcome to Your Dashboard</h1>

        {user && (
          <div className="user-welcome">
            <h2>Hello, {user.name}!</h2>
            <p>You're logged in with: {user.email}</p>
          </div>
        )}

        <div className="dashboard-actions">
          <button className="action-button">View Profile</button>
          <button className="action-button">My Settings</button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {!splineLoaded && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}
