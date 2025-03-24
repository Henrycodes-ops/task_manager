import React from "react";
import { FiFile, FiImage, FiCode, FiFileText } from "react-icons/fi";

const FilesList = () => {
  const files = [
    {
      name: "Layout and Pages templates.psd",
      size: "12.5 MB",
      icon: <FiImage />,
    },
    { name: "Sample UI Kit.fig", size: "24.2 MB", icon: <FiCode /> },
    { name: "Sample mockup.sketch", size: "8.1 MB", icon: <FiImage /> },
    { name: "Technical Specs.fig", size: "2.3 MB", icon: <FiFileText /> },
  ];

  return (
    <div className="team-section">
      <div className="team-header">
        <h3 className="team-title">All files</h3>
        <span>View All</span>
      </div>

      <div className="files-list">
        {files.map((file, index) => (
          <div key={index} className="file-item">
            <div className="file-icon">{file.icon}</div>
            <div className="file-info">
              <div className="file-name">{file.name}</div>
              <div className="file-size">{file.size}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilesList;
