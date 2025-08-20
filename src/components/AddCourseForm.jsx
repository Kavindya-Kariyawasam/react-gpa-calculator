import React, { useState } from "react";

const AddCourseForm = ({ onAddCourse, onClose }) => {
  const [course, setCourse] = useState({ code: "", title: "", credit: "" });
  const [error, setError] = useState("");

  const validateCourse = () => {
    if (!course.code || !course.title || !course.credit) {
      setError("All fields are required");
      return false;
    }
    if (!/^[A-Z]{2}\d{4}$/.test(course.code)) {
      setError("Code must be like XX0000 (e.g., CM1111)");
      return false;
    }
    if (isNaN(course.credit) || course.credit <= 0) {
      setError("Credit must be a positive number");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateCourse()) {
      onAddCourse({ ...course, credit: parseFloat(course.credit) });
      onClose();
    }
  };

  return (
    <div className="add-course-form">
      <h3>Add New Course</h3>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Course Code"
          value={course.code}
          onChange={(e) =>
            setCourse({ ...course, code: e.target.value.toUpperCase() })
          }
        />
        <input
          type="text"
          placeholder="Course Title"
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
        />
        <input
          type="number"
          step="0.5"
          placeholder="Credit Units"
          value={course.credit}
          onChange={(e) => setCourse({ ...course, credit: e.target.value })}
        />
        <div className="form-buttons">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Add Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm;
