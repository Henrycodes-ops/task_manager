import React from "react";
import ProjectCard from "./ProjectCard";

const TeamSection = () => {
  const projects = [
    
  ];

  return (
    <div>
      <div className="team-header">
        <h3 className="team-title">Team</h3>
        <span>View All</span>
      </div>

      <div className="team-grid">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
};

export default TeamSection;
