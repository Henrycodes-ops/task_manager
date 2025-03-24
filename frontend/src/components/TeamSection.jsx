import React from "react";
import ProjectCard from "./ProjectCard";

const TeamSection = () => {
  const projects = [
    { title: "UX UI Design", progress: 65, members: 3 },
    { title: "Marketing", progress: 48, members: 4 },
    { title: "Development", progress: 72, members: 5 },
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
