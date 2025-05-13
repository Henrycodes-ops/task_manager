import React from "react";
import {
  FiGrid,
  FiCalendar,
  FiUsers,
  FiFolder,
  FiSettings,
  FiSearch,
  FiBell,
  FiPlus,
} from "react-icons/fi";
import "./css/dashboard.css";
import StatsCard from "./statsCard";
import Chart from "./Chart";
// import TeamSection from "./TeamSection";
import FilesList from "./FilesList";
import { Link } from "react-router-dom";

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-logo">
          <FiGrid /> Goolers
        </div>

        <div className="sidebar-menu">
          <div className="menu-item active">
            <FiGrid /> Home
          </div>

          <div className="menu-item">
            <Link to="/TaskPage" className="menu-link">
              <FiCalendar /> Tasks
            </Link>
          </div>

          <div className="menu-item">
            <FiFolder /> Projects
          </div>
          <div className="menu-item">
            <FiUsers /> Team
          </div>
          <div className="menu-item">
            <FiSettings /> Settings
          </div>
        </div>

        <div className="user-profile">
          <img
            src={user?.picture || "/placeholder-avatar.jpg"}
            alt="User"
            className="user-avatar"
          />
          <div className="user-info">
            <div className="user-name">{user?.name || "Guest User"}</div>
            <div className="user-role">{}</div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <h1>Management</h1>

          <div className="header-actions">
            <div className="header-btn">
              <FiSearch /> Search
            </div>
            <div className="header-btn">
              <FiBell />
            </div>
            <div className="header-btn">
              <FiPlus /> Ne
            </div>
          </div>
        </div>

        <div className="dashboard-stats">
          <StatsCard
            title="Ongoing Projects"
            value=""
            subtitle="Compared to last month"
          />
          <StatsCard title="Total Tasks" value="" subtitle="" />
          <StatsCard title="Active Users" value="" subtitle="" />
        </div>

        <div className="dashboard-grid">
          <div className="chart-container">
            <Chart />
          </div>

          <div className="project-preview">
            <div className="preview-title">
              <h3>File Preview</h3>
              <button className="header-btn">
                <FiPlus /> Add
              </button>
            </div>

            <div className="preview-image">
              <img src="" alt="Project preview" style={{}} />
            </div>

            <div className="user-profile">
              <img
                src={user?.picture || "/placeholder-avatar.jpg"}
                alt="User"
                className="user-avatar"
              />
              <div className="user-info">
                <div className="user-name">{user?.name || "Guest User"}</div>
                <div className="user-role">Project Owner</div>
              </div>
            </div>
          </div>
        </div>

        <div className="files-section">
          <FilesList />
        </div>

        <div className="team-section">
          {/* <TeamSection /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
