import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeBackground } from "./spline";
import { SplineLoadContext } from "./splineLoadProvider";
import { fetchWithAuth } from "../utils/api";
import api from "../config/api";
import "../app.css";
import "../components/css/dashboard.css";
import Dashboard from "./Dashboard";

export default function Home() {
  const { splineLoaded } = useContext(SplineLoadContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const data = await fetchWithAuth(api.user.profile);
      if (data.success) {
        setUser(data.user);
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
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Fetch fresh profile data
      fetchProfile();
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <div className="spline-background">
        <HomeBackground />
      </div>

      <div
        className={`dashboard-wrapper ${
          splineLoaded ? "with-background" : "loading"
        }`}
      >
        {user && <Dashboard user={user} />}
      </div>

      {!splineLoaded && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}
