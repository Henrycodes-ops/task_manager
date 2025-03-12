// Login.js
import { useContext } from "react";
import { SplineBlob } from "./spline";
import { SplineLoadContext } from "./splineLoadProvider";

export default function Login() {
  const { splineLoaded } = useContext(SplineLoadContext);

  return (
    <>
      {splineLoaded && (
        <main>
          <SplineBlob />
        </main>
      )}
      <div className="signup">

      </div>
    </>
  );
}
