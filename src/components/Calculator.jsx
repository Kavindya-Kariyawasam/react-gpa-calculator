import React, { useState } from "react";
import AddCourseForm from "./AddCourseForm";
import "../App.css";

const Calculator = () => {
  const [customCourses, setCustomCourses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCourse = (course) => {
    setCustomCourses([...customCourses, course]);
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
              <li key={i}>
                {c.code} - {c.title} ({c.credit} credits)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Calculator;
