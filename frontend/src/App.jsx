// import { useState } from "react";
import Spline from "@splinetool/react-spline";

export default function TaskManager() {
  return (
    <>
      <main className="appContainer">
        <div className="splineContainer">
          <Spline scene="https://prod.spline.design/g492ldEQrkUfS7zK/scene.splinecode" />
        </div>

        <div className="header">
            <h1>Manage your daily tasks</h1>
        <p>Team and Project management with solution providing App</p>

        <a href="./task.jsx" className="getStarted">
          <span className="getSpan">Get</span> Started
        </a>
        </div>

      
      </main>
    </>
  );
}
