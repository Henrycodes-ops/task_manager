
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="header">
      <h1>Manage your daily tasks</h1>
      <p>Team and Project management with solution providing App</p>
      <Link to="/home" className="getStarted">
        <span className="getSpan">Get Started</span>
      </Link>
    </div>
  );
}
