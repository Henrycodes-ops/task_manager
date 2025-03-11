export function SplineLoadProvider({ children }) {
  const [splineLoaded, setSplineLoaded] = useState(false);

  return (
    <SplineLoadContext.Provider value={{ splineLoaded, setSplineLoaded }}>
      {children}
    </SplineLoadContext.Provider>
  );
}
