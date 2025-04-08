import { useState, useContext, useEffect } from "react";
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

const SplineWrapper = ({ sceneUrl, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const { setSplineLoaded } = useContext(SplineLoadContext);

  useEffect(() => {
    // Reset state when component mounts
    setLoaded(false);
    setError(null);
  }, [sceneUrl]);

  const handleSplineLoad = () => {
    setLoaded(true);
    setSplineLoaded(true);
  };

  const handleSplineError = (error) => {
    console.error("Spline error:", error);
    setError("Failed to load 3D scene");
    setSplineLoaded(false);
  };

  // Handle WebGL context loss
  useEffect(() => {
    const handleContextLost = (event) => {
      event.preventDefault();
      setError("WebGL context lost. Please refresh the page.");
    };

    const handleContextRestored = () => {
      setError(null);
      setLoaded(false);
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      }
    };
  }, []);

  if (error) {
    return (
      <div className={className}>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {!loaded && <LoadingSpinner />}
      <Spline
        scene={sceneUrl}
        onLoad={handleSplineLoad}
        onError={handleSplineError}
      />
    </div>
  );
};

export default function SplineContainer() {
  return (
    <ErrorBoundary>
      <SplineWrapper
        sceneUrl="https://prod.spline.design/Yja0XAhwPaIh2nCb/scene.splinecode"
        className="splineContainer"
      />
    </ErrorBoundary>
  );
}

export function SplineBlob() {
  return (
    <ErrorBoundary>
      <SplineWrapper
        sceneUrl="https://prod.spline.design/KT77YMuJyvvFZfgQ/scene.splinecode"
        className="splineBlob"
      />
    </ErrorBoundary>
  );
}

export function HomeBackground() {
  return (
    <ErrorBoundary>
      <SplineWrapper
        sceneUrl="https://prod.spline.design/qNCG-6RvWhNaVArS/scene.splinecode"
        className="homeBackground"
      />
    </ErrorBoundary>
  );
}
