class StorageService {
  constructor() {
    this.COURSES_KEY = "gpa_calculator_courses";
    this.TEMPLATES_KEY = "gpa_calculator_templates";
    this.initializeExampleData();
  }

  // Initialize with example courses if storage is empty
  initializeExampleData() {
    const existingCourses = this.getCourses();
    if (existingCourses.length === 0) {
      const exampleCourses = [
        {
          code: "CM1111",
          name: "Fundamentals of Mathematics",
          credits: 2.5,
          degree: "Information Technology",
          university: "University of Moratuwa",
          country: "Sri Lanka",
        },
        {
          code: "IN1101",
          name: "Programming Fundamentals",
          credits: 4,
          degree: "Information Technology",
          university: "University of Moratuwa",
          country: "Sri Lanka",
        },
        {
          code: "IN1311",
          name: "Digital System Design",
          credits: 3,
          degree: "Information Technology",
          university: "University of Moratuwa",
          country: "Sri Lanka",
        },
        {
          code: "IN1321",
          name: "Computer Organization",
          credits: 2.5,
          degree: "Information Technology",
          university: "University of Moratuwa",
          country: "Sri Lanka",
        },
      ];

      localStorage.setItem(this.COURSES_KEY, JSON.stringify(exampleCourses));
    }
  }

  // Course Management
  getCourses() {
    try {
      const courses = localStorage.getItem(this.COURSES_KEY);
      return courses ? JSON.parse(courses) : [];
    } catch (error) {
      console.error("Error loading courses:", error);
      return [];
    }
  }

  // Validate if course has minimum required metadata for storage
  isValidForStorage(courseData) {
    return (
      courseData.code &&
      courseData.name &&
      courseData.credits &&
      courseData.degree &&
      courseData.university &&
      courseData.country
    );
  }

  saveCourse(courseData) {
    try {
      // Only save if all required metadata is provided
      if (!this.isValidForStorage(courseData)) {
        console.log(
          "Course not saved to storage: Missing required metadata (degree, university, country)"
        );
        return false;
      }

      const courses = this.getCourses();

      // Check if course already exists
      const existingIndex = courses.findIndex(
        (course) => course.code === courseData.code
      );

      if (existingIndex >= 0) {
        // Update existing course
        courses[existingIndex] = courseData;
        console.log("Updated existing course in storage:", courseData.code);
      } else {
        // Add new course
        courses.push(courseData);
        console.log("Added new course to storage:", courseData.code);
      }

      localStorage.setItem(this.COURSES_KEY, JSON.stringify(courses));
      return true;
    } catch (error) {
      console.error("Error saving course:", error);
      return false;
    }
  }

  deleteCourse(courseCode) {
    try {
      const courses = this.getCourses();
      const filteredCourses = courses.filter(
        (course) => course.code !== courseCode
      );
      localStorage.setItem(this.COURSES_KEY, JSON.stringify(filteredCourses));
      console.log("Deleted course from storage:", courseCode);
      return true;
    } catch (error) {
      console.error("Error deleting course:", error);
      return false;
    }
  }

  searchCourses(query) {
    const courses = this.getCourses();
    if (!query) return courses;

    const lowerQuery = query.toLowerCase();
    return courses.filter(
      (course) =>
        course.code.toLowerCase().includes(lowerQuery) ||
        course.name.toLowerCase().includes(lowerQuery) ||
        course.degree.toLowerCase().includes(lowerQuery) ||
        course.university.toLowerCase().includes(lowerQuery) ||
        course.country.toLowerCase().includes(lowerQuery)
    );
  }

  // Get courses count for debugging
  getCoursesCount() {
    return this.getCourses().length;
  }

  // Template Management
  getTemplates() {
    try {
      const templates = localStorage.getItem(this.TEMPLATES_KEY);
      return templates ? JSON.parse(templates) : [];
    } catch (error) {
      console.error("Error loading templates:", error);
      return [];
    }
  }

  saveTemplate(templateData) {
    try {
      const templates = this.getTemplates();
      templates.push(templateData);
      localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates));
      return true;
    } catch (error) {
      console.error("Error saving template:", error);
      return false;
    }
  }

  // Utility Methods
  clearAllData() {
    localStorage.removeItem(this.COURSES_KEY);
    localStorage.removeItem(this.TEMPLATES_KEY);
    console.log("Cleared all storage data");
  }

  clearCourses() {
    localStorage.removeItem(this.COURSES_KEY);
    console.log("Cleared courses storage");
  }

  exportData() {
    return {
      courses: this.getCourses(),
      templates: this.getTemplates(),
      exportDate: new Date().toISOString(),
    };
  }

  importData(data) {
    try {
      if (data.courses) {
        localStorage.setItem(this.COURSES_KEY, JSON.stringify(data.courses));
      }
      if (data.templates) {
        localStorage.setItem(
          this.TEMPLATES_KEY,
          JSON.stringify(data.templates)
        );
      }
      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }
}

export default new StorageService();
