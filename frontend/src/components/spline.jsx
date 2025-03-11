// spline.js
import { useState, useContext } from "react";
import Spline from "@splinetool/react-spline";
import { SplineLoadContext } from "./splineLoadProvider";

export function SplineContainer() {
  const [loaded, setLoaded] = useState(false);
  const { setSplineLoaded } = useContext(SplineLoadContext);

  const handleSplineLoad = () => {
    setLoaded(true);
    setSplineLoaded(true);
  };

  return (
    <div className="splineContainer">
      <Spline
        scene="https://prod.spline.design/Yja0XAhwPaIh2nCb/scene.splinecode"
        onLoad={handleSplineLoad}
      />
    </div>
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
    <div className="splineBlob">
      <Spline
        scene="https://prod.spline.design/KT77YMuJyvvFZfgQ/scene.splinecode"
        onLoad={handleSplineLoad}
      />
    </div>
  );
}
