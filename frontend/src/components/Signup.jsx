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
        <h2>Login</h2>
        <input type="text"  />
        <input type="text" />
        
        <button className="signUpWithGoogle">
          Sign up with google
        </button>
      </div>
    </>
  );
}
