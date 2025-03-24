import React from "react";

const StatsCard = ({ title, value, subtitle }) => {
  return (
    <div className="stats-card">
      <div className="stats-card-title">{title}</div>
      <div className="stats-card-value">{value}</div>
      <div className="stats-card-subtitle">{subtitle}</div>
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{
            width: `${
              typeof value === "string" && value.includes("%") ? value : "75%"
            }`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default StatsCard;
