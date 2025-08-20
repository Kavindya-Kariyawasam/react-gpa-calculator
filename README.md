# 🎓 GPA Calculator

A simple and interactive GPA Calculator built with **React.js**.  
This app allows students to manage their courses semester by semester, assign grades, and calculate their GPA dynamically.

---

## ✨ Features

- ➕ Add courses with **course code, title, credits, and semester**  
- 🎯 Assign **grades (A, B+, B, C+, …, F)** to each course  
- 📊 Calculate GPA automatically based on courses and credits  
- 📚 Support for **multiple semesters**  
- ❌ Remove courses from a semester  
- 🎨 Simple UI with basic styling (global CSS)  
- ⚡ Real-time GPA calculation as you update grades  

---

## 🛠️ Tech Stack

- **React.js** (Frontend library)  
- **CSS** (Styling, global stylesheet)  

---

## 📂 Project Structure

```plaintext
gpa-calculator/
│
├── public/              # Static files
├── src/
│   ├── components/
│   │   ├── Calculator.js       # Main GPA calculator logic
│   │   ├── AddCourseForm.js    # Form for adding new courses
│   │
│   ├── App.js                 # Root component
│   ├── App.css                # Global styles
│   └── index.js               # React entry point
│
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18 and **npm** ≥ 9  
  Check your versions:
  ```bash
  node -v
  npm -v

### Installation

#### 1. Clone the repository and enter the project folder:

git clone https://github.com/your-username/gpa-calculator.git
cd gpa-calculator

#### 2. Install dependencies:

npm install

### Run the app (development)

npm start

## Usage

📖 Usage

Click Add Course to open the form.

Pick a Semester from the dropdown.

Enter Course Code, Title, and Credits, then Add Course.

In each semester block, use the Grade dropdown to assign a grade.

View the Semester GPA at the bottom of each semester.

The Overall GPA appears at the bottom once at least one course exists.

Grade points used: A+/A (4.0), A- (3.7), B+ (3.3), B (3.0), B- (2.7), C+ (2.3), C (2.0), C- (1.7), D+ (1.3), D (1.0), F (0.0)
