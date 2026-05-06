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
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Student Management System</h1>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <StudentForm 
          onStudentAdded={handleStudentAdded}
          editingStudent={editingStudent}
          setEditingStudent={setEditingStudent}
        />
        <StudentList 
          refreshTrigger={refreshTrigger} 
          setEditingStudent={setEditingStudent}
        />
      </div>
    </div>
  );
}

export default App;
