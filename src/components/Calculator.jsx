import React, { useState } from "react";
import AddCourseForm from "./AddCourseForm";
import "../App.css";

const Calculator = () => {
  const [customCourses, setCustomCourses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // GPA values for each grade
  const gradePoints = {
    "A+": 4.0,
    "A": 4.0,
    "A-": 3.7,
    "B+": 3.3,
    "B": 3.0,
    "B-": 2.7,
    "C+": 2.3,
    "C": 2.0,
    "C-": 1.7,
    "D+": 1.3,
    "D": 1.0,
    "F": 0.0,
  };

  const handleAddCourse = (course) => {
    setCustomCourses([...customCourses, { ...course, grade: "A" }]);
  };

  // Function to calculate GPA
  const calculateGPA = () => {
    if (customCourses.length === 0) return 0;
    let totalPoints = 0;
    let totalCredits = 0;
    customCourses.forEach((c) => {
      const points = gradePoints[c.grade] * c.credit;
      totalPoints += points;
      totalCredits += c.credit;
    });
    return totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  return (
    <div className="calculator">
      <button className="add-course-btn" onClick={() => setShowAddForm(true)}>
        Add Course
      </button>

      {showAddForm && (
        <AddCourseForm
          onAddCourse={handleAddCourse}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {customCourses.length > 0 && (
        <div className="custom-course-list">
          <h3>Custom Courses</h3>
          <ul>
            {customCourses.map((c, i) => (
              <li key={i} className="course-item">
                <span className="course-info">
                  {c.code} - {c.title} ({c.credit} credits)
                </span>
                <select
                  className="grade-select"
                  value={c.grade}
                  onChange={(e) => {
                    const updatedCourses = [...customCourses];
                    updatedCourses[i].grade = e.target.value;
                    setCustomCourses(updatedCourses);
                  }}
                >
                  {Object.keys(gradePoints).map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
          {customCourses.length > 0 && (
            <div className="gpa-display">GPA: {calculateGPA()}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calculator;
