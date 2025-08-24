# 🎓 GPA Calculator

A smart and interactive GPA Calculator built with **React.js** that helps students manage courses, calculate GPAs, and build a personal course library.

---

## ✨ Key Features

### 📚 Course Management
- ➕ **Add courses** with code, title, credits, and grades
- 🔍 **Smart course search** with auto-complete dropdown
- 💾 **Course library** that saves courses for future semesters
- ✏️ **Edit/Delete** saved courses from your library
- 🚫 **Duplicate prevention** - used courses are visually marked

### 📊 GPA Calculation
- 🎯 **Real-time GPA calculation** as you update grades
- 📈 **Semester-wise GPA** display for each semester
- 🏆 **Overall cumulative GPA** across all semesters
- 📋 **Module viewer** showing all courses in a table format

### 🗂️ Semester Organization
- 📚 **Multiple semester support** with custom naming
- ❌ **Remove courses** from specific semesters
- 🔄 **Semester reset** with undo functionality
- ⚡ **Dynamic semester addition**

### 🎨 User Experience
- 💡 **Intelligent form validation** with helpful error messages
- 🔄 **Undo system** for accidental changes
- 📱 **Responsive design** for mobile and desktop
- 🎨 **Modern UI** with clean styling and hover effects

### 💾 Data Persistence
- 🏠 **Local storage** keeps your data safe
- 📈 **Metadata support** - degree, university, country tracking
- 🔍 **Advanced search** across all course fields
- 📊 **Course usage tracking** prevents duplicates

---

## 🛠️ Tech Stack

- **React.js** (Frontend framework)
- **React Icons** (Icon library)
- **CSS3** (Modern styling with gradients and animations)
- **localStorage** (Client-side data persistence)

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd react-gpa-calculator

# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📂 Project Structure

```plaintext
react-gpa-calculator/
├── public/
├── src/
│   ├── components/
│   │   ├── AddCourseForm.jsx      # Smart course addition form
│   │   ├── Calculator.jsx         # Main GPA calculator
│   │   └── ModuleViewer.jsx       # Course overview table
│   ├── services/
│   │   └── StorageService.js      # Data persistence service
│   ├── App.js                     # Main application component
│   ├── App.css                    # Global styles
│   └── index.js                   # Application entry point
├── package.json
└── README.md
```

---

## 🎯 How It Works

### Adding Courses
1. Click **"Add Course"** button
2. Type course code/title to see suggestions from your library
3. Fill in course details (metadata optional but recommended)
4. Select target semester and submit

### Building Your Course Library
- Courses with complete metadata (degree, university, country) are automatically saved
- Saved courses appear in dropdown for future semesters
- Edit or delete courses from your library using "Manage" mode

### GPA Calculation
- Assign grades (A, B+, B, C+, C, D+, D, F) to each course
- GPA is calculated using 4.0 scale with credit weighting
- View semester GPAs and overall cumulative GPA

### Smart Features
- **Duplicate Prevention**: Already used courses are grayed out
- **Undo System**: Revert accidental deletions or resets
- **Real-time Updates**: GPA updates instantly when grades change
- **Responsive Design**: Works seamlessly on all devices

---

## 🔮 Future Enhancements

- 🌐 **Cloud storage** with user accounts
- 🎓 **University course databases**
- 📤 **Export/Import** functionality
- 📊 **Grade analytics** and progress tracking
- 👥 **Course sharing** with classmates

---