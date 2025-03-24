import React from "react";

const Chart = () => {
  // This is a placeholder for an actual chart library
  // You would typically use libraries like recharts or chart.js here
  return (
    <div>
      <h3 style={{ marginBottom: "1rem", color: "rgba(255, 255, 255, 0.9)" }}>
        Project Progress
      </h3>

      {/* Simple SVG chart placeholder */}
      <svg width="100%" height="200" viewBox="0 0 400 200">
        <path
          d="M0,150 C50,120 100,180 150,100 C200,20 250,80 300,60 C350,40 400,80 400,100"
          fill="none"
          stroke="rgba(120, 120, 255, 0.6)"
          strokeWidth="3"
        />
        <path
          d="M0,180 C50,160 100,190 150,140 C200,90 250,120 300,110 C350,100 400,130 400,150"
          fill="none"
          stroke="rgba(255, 120, 255, 0.4)"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
};

export default Chart;
