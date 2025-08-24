import React, { useState, useEffect } from "react";
import StorageService from "../services/StorageService";
import {
  IoChevronDown,
  IoCheckmarkCircle,
  IoWarning,
  IoLibrary,
} from "react-icons/io5";

const AddCourseForm = ({ semesters, onAddCourse, onClose }) => {
  const [course, setCourse] = useState({
    code: "",
    title: "",
    credit: "",
    degree: "",
    university: "",
    country: "",
  });
  const [selectedSemester, setSelectedSemester] = useState(0);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [availableCourses, setAvailableCourses] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isCustomEntry, setIsCustomEntry] = useState(true);

  // Load available courses on component mount
  useEffect(() => {
    const savedCourses = StorageService.getCourses();
    setAvailableCourses(savedCourses);
    console.log(`Loaded ${savedCourses.length} courses from storage`);
  }, []);

  // Filter courses based on input
  useEffect(() => {
    if (course.code || course.title) {
      const filtered = StorageService.searchCourses(
        course.code || course.title
      );
      setFilteredCourses(filtered);
      setShowDropdown(filtered.length > 0 && (course.code || course.title));
    } else {
      setFilteredCourses(availableCourses);
      setShowDropdown(false);
    }
  }, [course.code, course.title, availableCourses]);

  const validateCourse = () => {
    if (!course.code || !course.title || !course.credit) {
      setError("Course code, title, and credit are required");
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

  const handleSelectCourse = (selectedCourse) => {
    setCourse({
      code: selectedCourse.code,
      title: selectedCourse.name,
      credit: selectedCourse.credits.toString(),
      degree: selectedCourse.degree || "",
      university: selectedCourse.university || "",
      country: selectedCourse.country || "",
    });
    setShowDropdown(false);
    setIsCustomEntry(false);
    setInfo(`Selected course from storage: ${selectedCourse.code}`);
    setError("");
  };

  const handleInputChange = (field, value) => {
    setCourse({ ...course, [field]: value });
    setIsCustomEntry(true);
    setError("");
    setInfo("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateCourse()) {
      const courseForApp = {
        code: course.code,
        title: course.title,
        credit: parseFloat(course.credit),
      };

      // Try to save to storage with full metadata if it's a custom entry
      if (isCustomEntry) {
        const courseForStorage = {
          code: course.code,
          name: course.title,
          credits: parseFloat(course.credit),
          degree: course.degree.trim(),
          university: course.university.trim(),
          country: course.country.trim(),
        };

        const savedToStorage = StorageService.saveCourse(courseForStorage);

        if (savedToStorage) {
          setInfo(`✅ Course saved to storage for future use!`);
          // Update local state
          setAvailableCourses(StorageService.getCourses());
        } else {
          setInfo(
            `⚠️ Course added to semester but not saved to storage (missing: degree, university, or country)`
          );
        }
      }

      onAddCourse(courseForApp, selectedSemester);

      // Don't close immediately, show the info message
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const clearForm = () => {
    setCourse({
      code: "",
      title: "",
      credit: "",
      degree: "",
      university: "",
      country: "",
    });
    setIsCustomEntry(true);
    setShowDropdown(false);
    setError("");
    setInfo("");
  };

  const canSaveToStorage = () => {
    return (
      course.code &&
      course.title &&
      course.credit &&
      course.degree.trim() &&
      course.university.trim() &&
      course.country.trim()
    );
  };

  return (
    <div className="add-course-form">
      <h3>Add New Course</h3>
      {error && <p className="error-message">{error}</p>}
      {info && <p className="info-message">{info}</p>}

      <form onSubmit={handleSubmit}>
        <div className="semester-selector-wrapper">
          <select
            className="semester-selector"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
          >
            {semesters.map((sem, index) => (
              <option key={index} value={index}>
                {sem.name}
              </option>
            ))}
          </select>
        </div>

        <div className="course-input-container">
          <input
            type="text"
            placeholder="Course Code (e.g., IN1111)"
            value={course.code}
            onChange={(e) =>
              handleInputChange("code", e.target.value.toUpperCase())
            }
            onFocus={() => setShowDropdown(filteredCourses.length > 0)}
          />

          <input
            type="text"
            placeholder="Course Title"
            value={course.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            onFocus={() => setShowDropdown(filteredCourses.length > 0)}
          />

          <input
            type="number"
            step="0.5"
            placeholder="Credit Units"
            value={course.credit}
            onChange={(e) => handleInputChange("credit", e.target.value)}
          />

          {/* Optional metadata fields with storage indicator */}
          <div className="metadata-fields">
            <div className="metadata-note">
              Fill these to save course for future use:
            </div>
            <input
              type="text"
              placeholder="Degree (e.g., Information Technology)"
              value={course.degree}
              onChange={(e) => handleInputChange("degree", e.target.value)}
            />

            <input
              type="text"
              placeholder="University (e.g., University of Moratuwa)"
              value={course.university}
              onChange={(e) => handleInputChange("university", e.target.value)}
            />

            <input
              type="text"
              placeholder="Country (e.g., Sri Lanka)"
              value={course.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
            />

            <div
              className={`storage-indicator ${
                canSaveToStorage() ? "can-save" : "cannot-save"
              }`}
            >
              {canSaveToStorage() ? (
                <>
                  <IoCheckmarkCircle /> Will be saved to storage
                </>
              ) : (
                <>
                  <IoWarning /> Won't be saved to storage (missing info)
                </>
              )}
            </div>
          </div>

          {showDropdown && filteredCourses.length > 0 && (
            <div className="course-dropdown">
              <div className="dropdown-header">
                <span>
                  <IoLibrary /> Available Courses ({filteredCourses.length})
                </span>
                <button
                  type="button"
                  className="close-dropdown"
                  onClick={() => setShowDropdown(false)}
                >
                  ×
                </button>
              </div>
              {filteredCourses.slice(0, 8).map((savedCourse, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleSelectCourse(savedCourse)}
                >
                  <div className="course-info">
                    <strong>{savedCourse.code}</strong> - {savedCourse.name}
                    <span className="credit-info">
                      ({savedCourse.credits} credits)
                    </span>
                  </div>
                  <div className="course-meta">
                    {savedCourse.degree} • {savedCourse.university} •{" "}
                    {savedCourse.country}
                  </div>
                </div>
              ))}
              {filteredCourses.length > 8 && (
                <div className="dropdown-more">
                  ... and {filteredCourses.length - 8} more courses
                </div>
              )}
            </div>
          )}
        </div>

        <div className="form-buttons">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="clear-btn" onClick={clearForm}>
            Clear
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
