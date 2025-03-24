import React from "react";

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <div className="project-card-title">{project.title}</div>

      <div className="project-card-stats">
        <span>Progress</span>
        <span>{project.progress}%</span>
      </div>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${project.progress}%` }}
        ></div>
      </div>

      <div className="avatar-group">
        {Array(project.members)
          .fill(0)
          .map((_, idx) => (
            <img
              key={idx}
              src={`/api/placeholder/${30 + idx}/${30 + idx}`}
              alt="Team member"
              className="avatar"
            />
          ))}
      </div>
    </div>
  );
};

export default ProjectCard;
