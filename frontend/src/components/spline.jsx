import { useState, useContext } from "react";
import Spline from "@splinetool/react-spline";
import { SplineLoadContext } from "./splineLoadProvider";
import ErrorBoundary from "./ErrorBoundary";
import "./css/spline.css";

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading 3D Scene...</p>
  </div>
);

export default function SplineContainer() {
  const [loaded, setLoaded] = useState(false);
  const { setSplineLoaded } = useContext(SplineLoadContext);

  const handleSplineLoad = () => {
    setLoaded(true);
    setSplineLoaded(true);
  };

  return (
    <ErrorBoundary>
      <div className="splineContainer">
        {!loaded && <LoadingSpinner />}
        <Spline
          scene="https://prod.spline.design/Yja0XAhwPaIh2nCb/scene.splinecode"
          onLoad={handleSplineLoad}
        />
      </div>
    </ErrorBoundary>
  );
}

export function SplineBlob() {
  const [loaded, setLoaded] = useState(false);
  const { setSplineLoaded } = useContext(SplineLoadContext);

  const handleSplineLoad = () => {
    setLoaded(true);
    setSplineLoaded(true);
  };

  return (
    <ErrorBoundary>
      <div className="splineBlob">
        {!loaded && <LoadingSpinner />}
        <Spline
          scene="https://prod.spline.design/KT77YMuJyvvFZfgQ/scene.splinecode"
          onLoad={handleSplineLoad}
        />
      </div>
    </ErrorBoundary>
  );
}

export function HomeBackground() {
  const [loaded, setLoaded] = useState(false);
  const { setSplineLoaded } = useContext(SplineLoadContext);

  const handleSplineLoad = () => {
    setLoaded(true);
    setSplineLoaded(true);
  };

  return (
    <ErrorBoundary>
      <div className="homeBackground">
        {!loaded && <LoadingSpinner />}
        <Spline
          scene="https://prod.spline.design/qNCG-6RvWhNaVArS/scene.splinecode"
          onLoad={handleSplineLoad}
        />
      </div>
    </ErrorBoundary>
  );
}
