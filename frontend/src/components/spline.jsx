import React, { useState, createContext, useContext, useEffect } from "react";

import Spline from "@splinetool/react-spline";

const SplineContext = createContext({ loaded: false });

export default function SplineContainer() {
  const [loaded, setLoaded] = useState(false);
  const { setSplineLoaded } = useContext(SplineLoadContext);

  const handleSplineLoad = () => {
    setLoaded(true);
    setSplineLoaded(true);
  };

  return (
    <div className="splineContainer">
      <Spline scene="https://prod.spline.design/Yja0XAhwPaIh2nCb/scene.splinecode" onLoad={handleSplineLoad}/>
    </div>
  );
}

export function SplineBlob() {

  return (
    <div className="splineBlob">
      <Spline scene="https://prod.spline.design/KT77YMuJyvvFZfgQ/scene.splinecode" />
    </div>
  );
}
