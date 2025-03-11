// First, define a shared context file (create a new file called SplineContext.js)
import { createContext, useState } from "react";

export const SplineLoadContext = createContext({
  splineLoaded: false,
  setSplineLoaded: () => {},
});

export function SplineLoadProvider({ children }) {
  const [splineLoaded, setSplineLoaded] = useState(false);

  return (
    <SplineLoadContext.Provider value={{ splineLoaded, setSplineLoaded }}>
      {children}
    </SplineLoadContext.Provider>
  );
}
