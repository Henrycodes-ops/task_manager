
import { Link } from "react-router-dom";

export default function Header() {
  const { splineLoaded } = useContext(SplineLoadContext);
  return (
    <div className="header">
      { splineLoaded &&
        <Link to="/login" className="getStarted">
        <span className="getSpan">Get Started</span>
      </Link>
      }
      
      
    </div>
  );
}
 