
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="header">
      
      <Link to="/login" className="getStarted">
        <span className="getSpan">Get Started</span>
      </Link>
    </div>
  );
}
 