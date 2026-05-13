import React, { useState } from 'react';
import './App.css';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingStudent, setEditingStudent] = useState(null);

  const handleStudentAdded = () => {
    // Trigger a refresh of the student list
    setRefreshTrigger(prev => prev + 1);
    // Clear editing state
    setEditingStudent(null);
  };

  return (
    <div className="App">
      <div className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
          <img 
            src="https://web.ua.edu.ph/wp-content/uploads/2024/09/ua-logo.png" 
            alt="UA Logo"
            style={{
              height: '100px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ margin: '0 0 10px 0' }}>Student Management System</h1>
            <p style={{ margin: '0', opacity: 0.9 }}>Manage your students efficiently and effectively</p>
          </div>
        </div>
      </div>
      <div className="app-container">
        <div className="section">
          <StudentForm 
            onStudentAdded={handleStudentAdded}
            editingStudent={editingStudent}
            setEditingStudent={setEditingStudent}
          />
        </div>
        <div className="section">
          <StudentList 
            refreshTrigger={refreshTrigger} 
            setEditingStudent={setEditingStudent}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
