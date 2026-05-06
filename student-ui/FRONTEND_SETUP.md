# Student Management System - Setup & Running Guide

## What Was Created

### Components Created:
1. **StudentForm.js** - Form to add new students
   - Fields: First Name (required), Last Name, Course (required), Year Level, Section, Gender
   - Validates required fields
   - Handles POST requests to add students
   - Clears form after successful submission

2. **StudentList.js** - Displays all students in a table
   - Fetches students from API on component load
   - Shows student details: First Name, Last Name, Course, Year Level, Section, Gender
   - Delete button for each student with confirmation
   - Refreshes list when new student is added

3. **Updated App.js** - Main component
   - Manages refresh trigger state
   - Integrates StudentForm and StudentList components

### Backend Updates:
1. **Added CORS** to server.js to allow frontend communication
2. **Added CORS package** to project dependencies

## How to Run

### Terminal 1: Start Express Server
```bash
cd "d:\GARCIA_WSES\PCIT18 Activity\PCIT18"
npm install    # (if not already done)
node server.js
```

Expected output:
```
MongoDB Connected
Server running in port 3000
```

### Terminal 2: Start React Frontend
```bash
cd "d:\GARCIA_WSES\PCIT18 Activity\PCIT18\frontend\student-ui"
npm install    # (if not already done)
npm start
```

The React app will open in your browser at `http://localhost:3001` (or `http://localhost:3000` if port 3000 is available)

## Features

✅ **Display Students** - View all students in a table format
✅ **Add Student** - Form with required fields (First Name, Course)
✅ **Delete Student** - Remove students with confirmation
✅ **Form Validation** - Required fields are enforced
✅ **Error Handling** - Catches and displays API errors
✅ **Loading States** - Shows loading indicators

## API Endpoints Used

- **GET /api/students** - Get all students
- **POST /api/students** - Create new student
- **DELETE /api/students/:id** - Delete student by ID

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, you can:
- Kill the process using port 3000, or
- Change the Express server port in `server.js` and update the proxy in React's `package.json`

### MongoDB Connection Error
Ensure MongoDB is running:
```bash
mongod
```

### CORS Errors
CORS has been enabled on the server. If you still see errors, ensure:
- Express server is running on port 3000
- React proxy in package.json points to `http://localhost:3000`

### API Calls Not Working
- Check browser console (F12) for errors
- Verify Express server is running
- Check that MongoDB is connected
- Ensure network request shows successful response in Network tab

## File Structure
```
frontend/student-ui/
├── src/
│   ├── components/
│   │   ├── StudentForm.js (NEW)
│   │   └── StudentList.js (NEW)
│   ├── App.js (UPDATED)
│   └── ... other files
└── package.json (UPDATED - added proxy)
```

## Next Steps (Optional Enhancements)
- Add Edit functionality (PUT endpoint is already available)
- Add filters for course, year level, section, gender
- Add pagination for large student lists
- Add better styling/CSS
- Add input validation for better UX
- Add loading skeletons for better UX
