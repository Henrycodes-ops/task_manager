// import { useState } from "react";


import SplineContainer from "./spline";
// import Navbar from "./navbar";

export default function TaskManager() {
  return (
    <>
      <main className="appContainer ">
        {/* <Navbar /> */}

        <div className="header">
          <h1>Manage your daily tasks</h1>
          <p>Team and Project management with solution providing App</p>
          <a href="./task.jsx" className="getStarted">
            <span className="getSpan">Get</span> Started
          </a>
        </div>

        <SplineContainer />
      </main>
    </>
  );
}
