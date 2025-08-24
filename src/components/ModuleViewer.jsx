import React from "react";

const ModuleViewer = ({ modules }) => {
  if (!modules || modules.length === 0) {
    return null;
  }

  return (
    <div className="module-viewer">
      <h3>All Courses Overview</h3>
      <table>
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Title</th>
            <th>Credits</th>
            <th>Grade</th>
            <th>Semester</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((module, index) => (
            <tr key={index}>
              <td>{module.code}</td>
              <td>{module.title}</td>
              <td>{module.credits}</td>
              <td>{module.grade}</td>
              <td>{module.semester}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModuleViewer;
