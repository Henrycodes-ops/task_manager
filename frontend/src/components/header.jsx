// Header.js
import { useContext } from "react";
import { Link } from "react-router-dom";
import { SplineLoadContext } from "./splineLoadProvider";

export default function Header() {
  const { splineLoaded } = useContext(SplineLoadContext);

  return (
    <div className="header">
      {splineLoaded && (
        <div>
          <Link to="/login">
            <span className="getStarted">Get Started</span>
          </Link>
        </div>
      )}
    </div>
  );
}
