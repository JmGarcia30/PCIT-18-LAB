import React, { useState, useEffect } from 'react';

function StudentList({ refreshTrigger, setEditingStudent }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch students from API
  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/students');
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err.message || 'Error fetching students');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch students on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchStudents();
  }, [refreshTrigger]);

  // Handle edit student
  const handleEdit = (student) => {
    setEditingStudent(student);
    // Scroll to top to see form
    window.scrollTo(0, 0);
  };

  // Handle delete student
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      // Remove student from local state
      setStudents(prev => prev.filter(student => student._id !== id));
      alert('Student deleted successfully');
    } catch (err) {
      alert('Error deleting student: ' + err.message);
      console.error('Error:', err);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px' }}>
      <h2>Student List</h2>
      
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      {loading && <p>Loading students...</p>}
      
      {!loading && students.length === 0 && (
        <p style={{ color: '#666' }}>No students found. Add one using the form above.</p>
      )}

      {!loading && students.length > 0 && (
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '10px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #333' }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>First Name</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Last Name</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Course</th>
              <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{student.firstname || '-'}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{student.lastname || '-'}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{student.course || '-'}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEdit(student)}
                    style={{
                      padding: '6px 12px',
                      marginRight: '8px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentList;
