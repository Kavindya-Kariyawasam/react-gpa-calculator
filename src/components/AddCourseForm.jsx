import React, { useState, useEffect } from "react";
import StorageService from "../services/StorageService";
import {
  IoCheckmarkCircle,
  IoWarning,
  IoLibrary,
  IoTrash,
  IoCreate,
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
  const [showManagement, setShowManagement] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Load available courses on component mount
  useEffect(() => {
    const savedCourses = StorageService.getCourses();
    setAvailableCourses(savedCourses);
    console.log(`Loaded ${savedCourses.length} courses from storage`);
  }, []);

  // Function to check if a course is already used in any semester
  const isCourseUsed = (courseCode) => {
    return semesters.some((semester) =>
      semester.courses.some((course) => course.code === courseCode)
    );
  };

  // Filter courses based on input
  useEffect(() => {
    if (course.code || course.title) {
      const filtered = StorageService.searchCourses(
        course.code || course.title
      );

      // Separate used and unused courses
      const unusedCourses = filtered.filter((c) => !isCourseUsed(c.code));
      const usedCourses = filtered.filter((c) => isCourseUsed(c.code));

      // Put unused courses first, then used courses
      const sortedCourses = [...unusedCourses, ...usedCourses];

      setFilteredCourses(sortedCourses);
      setShowDropdown(
        sortedCourses.length > 0 && (course.code || course.title)
      );
    } else {
      const allCourses = StorageService.getCourses();
      const unusedCourses = allCourses.filter((c) => !isCourseUsed(c.code));
      const usedCourses = allCourses.filter((c) => isCourseUsed(c.code));
      const sortedCourses = [...unusedCourses, ...usedCourses];

      setFilteredCourses(sortedCourses);
      setShowDropdown(false);
    }
  }, [course.code, course.title, availableCourses, semesters]);

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
    // Blocking selection of used courses
    if (isCourseUsed(selectedCourse.code)) {
      setError(`Course ${selectedCourse.code} is already added to a semester`);
      return;
    }

    setCourse({
      code: selectedCourse.code,
      title: selectedCourse.name,
      credit: selectedCourse.credits.toString(),
      degree: selectedCourse.degree || "",
      university: selectedCourse.university || "",
      country: selectedCourse.country || "",
    });

    setIsCustomEntry(false);
    setInfo(`Selected course from storage: ${selectedCourse.code}`);
    setError("");

    setTimeout(() => {
      setShowDropdown(false);
    }, 0);
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

  const handleDeleteCourse = (courseCode) => {
    if (window.confirm(`Delete course ${courseCode} from saved courses?`)) {
      StorageService.deleteCourse(courseCode);
      setAvailableCourses(StorageService.getCourses());
      setInfo(`Course ${courseCode} deleted from storage`);
    }
  };

  const handleEditCourse = (courseToEdit) => {
    setCourse({
      code: courseToEdit.code,
      title: courseToEdit.name,
      credit: courseToEdit.credits.toString(),
      degree: courseToEdit.degree,
      university: courseToEdit.university,
      country: courseToEdit.country,
    });
    setEditingCourse(courseToEdit.code);
    setShowManagement(false);
    setIsCustomEntry(true);
    setShowDropdown(false);
    setInfo(`Editing course: ${courseToEdit.code}`);
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
                <div className="header-actions">
                  <button
                    type="button"
                    className="manage-btn"
                    onClick={() => setShowManagement(!showManagement)}
                  >
                    {showManagement ? "Done" : "Manage"}
                  </button>
                  <button
                    type="button"
                    className="close-dropdown"
                    onClick={() => setShowDropdown(false)}
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="dropdown-content">
                {filteredCourses.slice(0, 8).map((savedCourse, index) => {
                  const isUsed = isCourseUsed(savedCourse.code);
                  return (
                    <div
                      key={index}
                      className={`dropdown-item ${isUsed ? "course-used" : ""}`}
                    >
                      <div
                        className="course-info"
                        onClick={() =>
                          !showManagement &&
                          !isUsed &&
                          handleSelectCourse(savedCourse)
                        }
                        style={{
                          cursor: showManagement
                            ? "default"
                            : isUsed
                            ? "not-allowed"
                            : "pointer",
                          opacity: isUsed ? 0.6 : 1,
                        }}
                      >
                        <div>
                          <strong>{savedCourse.code}</strong> -{" "}
                          {savedCourse.name}
                          <span className="credit-info">
                            ({savedCourse.credits} credits)
                          </span>
                          {isUsed && (
                            <span className="used-indicator">
                              ✓ Already Added
                            </span>
                          )}
                        </div>
                        <div className="course-meta">
                          {savedCourse.degree} • {savedCourse.university} •{" "}
                          {savedCourse.country}
                        </div>
                      </div>
                      {showManagement && (
                        <div className="course-actions">
                          <button
                            type="button"
                            className="edit-course-btn"
                            onClick={() => handleEditCourse(savedCourse)}
                            title="Edit course"
                          >
                            <IoCreate />
                          </button>
                          <button
                            type="button"
                            className="delete-course-btn"
                            onClick={() => handleDeleteCourse(savedCourse.code)}
                            title="Delete course"
                          >
                            <IoTrash />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {filteredCourses.length > 8 && (
                  <div className="dropdown-more">
                    ... and {filteredCourses.length - 8} more courses
                  </div>
                )}
              </div>
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
