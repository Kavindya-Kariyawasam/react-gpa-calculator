import React, { useState } from "react";
import AddCourseForm from "./AddCourseForm";
import "../App.css";

const Calculator = () => {
  const [semesters, setSemesters] = useState([
    { name: "Semester 1", courses: [] },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [removedStack, setRemovedStack] = useState([]); // stack for multiple undo

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

  const handleAddCourse = (course, semesterIndex) => {
    const newSemesters = [...semesters];
    newSemesters[semesterIndex].courses.push({ ...course, grade: "A" });
    setSemesters(newSemesters);
  };

  const handleRemoveCourse = (semIndex, courseIndex) => {
    const courseToRemove = semesters[semIndex].courses[courseIndex];
    const newSemesters = [...semesters];
    newSemesters[semIndex].courses.splice(courseIndex, 1);
    setSemesters(newSemesters);

    setRemovedStack([
      ...removedStack,
      { course: courseToRemove, semIndex, courseIndex },
    ]);
  };

  const handleUndo = () => {
    if (removedStack.length === 0) return;
    const lastRemoved = removedStack[removedStack.length - 1];
    const { course, semIndex, courseIndex } = lastRemoved;
    const newSemesters = [...semesters];
    newSemesters[semIndex].courses.splice(courseIndex, 0, course);
    setSemesters(newSemesters);
    setRemovedStack(removedStack.slice(0, -1));
  };

  // Function to calculate GPA
  const calculateGPA = (coursesList) => {
    if (coursesList.length === 0) return 0;
    let totalPoints = 0;
    let totalCredits = 0;
    coursesList.forEach((c) => {
      const points = gradePoints[c.grade] * c.credit;
      totalPoints += points;
      totalCredits += c.credit;
    });
    return totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  return (
    <div className="calculator">
      <div className="button-container">
        <button className="add-course-btn" onClick={() => setShowAddForm(true)}>
          Add Course
        </button>
        <button
          className="add-semester-btn"
          onClick={() =>
            setSemesters([
              ...semesters,
              { name: `Semester ${semesters.length + 1}`, courses: [] },
            ])
          }
        >
          Add Semester
        </button>
        {removedStack.length > 0 && (
          <button onClick={handleUndo} className="undo-btn">
            Undo ({removedStack.length})
          </button>
        )}
      </div>

      {showAddForm && (
        <AddCourseForm
          semesters={semesters}
          onAddCourse={handleAddCourse}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {semesters.map((sem, sIndex) => (
        <div key={sIndex} className="semester-container">
          <h3>{sem.name}</h3>
          {sem.courses.length === 0 ? (
            <p className="no-courses">No courses added yet</p>
          ) : (
            <ul className="semester-course-list">
              {sem.courses.map((c, i) => (
                <li key={i}>
                  <div className="course-info">
                    <span className="course-details">
                      {c.code} - {c.title} ({c.credit} credits)
                    </span>
                  </div>
                  <div className="course-controls">
                    <select
                      className="grade-select"
                      value={c.grade}
                      onChange={(e) => {
                        const newSemesters = [...semesters];
                        newSemesters[sIndex].courses[i].grade = e.target.value;
                        setSemesters(newSemesters);
                      }}
                    >
                      {Object.keys(gradePoints).map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleRemoveCourse(sIndex, i)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Semester GPA */}
          {sem.courses.length > 0 && (
            <div className="semester-gpa">
              Semester GPA: {calculateGPA(sem.courses)}
            </div>
          )}
        </div>
      ))}

      {/* Overall GPA */}
      {semesters.some((s) => s.courses.length > 0) && (
        <div className="overall-gpa">
          Overall GPA: {calculateGPA(semesters.flatMap((s) => s.courses))}
        </div>
      )}
    </div>
  );
};

export default Calculator;
