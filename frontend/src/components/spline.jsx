import Spline from "@splinetool/react-spline";

export default function SplineContainer() {
  return (
    <div className="splineContainer">
      <Spline scene="https://prod.spline.design/Yja0XAhwPaIh2nCb/scene.splinecode" />
    </div>
  );
}

export function SplineBlob() {
  return (
    <div className="splineBlob">
       <Spline
        scene="https://prod.spline.design/KT77YMuJyvvFZfgQ/scene.splinecode" 
      />
    </div>
  );
}
