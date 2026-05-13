import React, { useState, useEffect } from 'react';

function StudentList({ refreshTrigger, setEditingStudent }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');

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

  // Handle initiate delete with confirmation UI
  const handleInitiateDelete = (id) => {
    setPendingDeleteId(id);
  };

  // Handle confirm delete
  const handleConfirmDelete = async (id) => {
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
      setPendingDeleteId(null);
      setSuccessMessage('Student deleted successfully');
      
      // Auto-dismiss after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setDeleteErrorMessage('Error deleting student: ' + err.message);
      setPendingDeleteId(null);
      
      // Auto-dismiss after 3 seconds
      setTimeout(() => setDeleteErrorMessage(''), 3000);
      console.error('Error:', err);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setPendingDeleteId(null);
  };

  // Dismiss success message
  const dismissSuccessMessage = () => {
    setSuccessMessage('');
  };

  // Dismiss error message
  const dismissErrorMessage = () => {
    setDeleteErrorMessage('');
  };

  return (
    <div>
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '15px',
          maxWidth: '400px',
          animation: 'slideIn 0.3s ease'
        }}>
          <span style={{ fontWeight: '600', fontSize: '14px' }}>✓ {successMessage}</span>
          <button
            onClick={dismissSuccessMessage}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '0',
              lineHeight: '1'
            }}
          >
            ×
          </button>
        </div>
      )}

      {deleteErrorMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#A51A21',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '15px',
          maxWidth: '400px',
          animation: 'slideIn 0.3s ease'
        }}>
          <span style={{ fontWeight: '600', fontSize: '14px' }}>⚠ {deleteErrorMessage}</span>
          <button
            onClick={dismissErrorMessage}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '0',
              lineHeight: '1'
            }}
          >
            ×
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '8px',
        color: '#333',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        Student List
      </h2>
      <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>
        Total Students: <strong style={{ color: '#011B51', fontSize: '16px' }}>{students.length}</strong>
      </p>
      
      {error && <div style={{ 
        color: '#A51A21', 
        fontWeight: '600', 
        backgroundColor: '#fff5f5',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        borderLeft: '4px solid #A51A21'
      }}>{error}</div>}
      
      {loading && <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#999'
      }}>
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>Loading students...</p>
      </div>}
      
      {!loading && students.length === 0 && (
        <div style={{
          backgroundColor: '#f5f5f5',
          border: '2px dashed #ddd',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          color: '#999'
        }}>
          <p style={{ fontSize: '16px', margin: '0' }}>No students found. Add one using the form above.</p>
        </div>
      )}

      {!loading && students.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {students.map((student) => (
            <div key={student._id} style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid #e8e8e8'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(1, 27, 81, 0.15)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#333',
                  margin: '0 0 8px 0'
                }}>
                  {student.firstname} {student.lastname}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#999',
                  margin: '0'
                }}>
                  {student.firstname ? 'Student' : 'N/A'}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#999',
                    margin: '0 0 4px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Course
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#333',
                    margin: '0',
                    fontWeight: '600'
                  }}>
                    {student.course || 'N/A'}
                  </p>
                </div>

                {student.lastname && (
                  <div>
                    <p style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#999',
                      margin: '0 0 4px 0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Last Name
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#333',
                      margin: '0'
                    }}>
                      {student.lastname}
                    </p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleEdit(student)}
                  style={{
                    flex: '1',
                    minWidth: '70px',
                    padding: '10px 12px',
                    backgroundColor: '#011B51',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(1, 27, 81, 0.3)'
                  }}
                  onMouseEnter={(e) => (e.target.style.boxShadow = '0 4px 12px rgba(1, 27, 81, 0.4)', e.target.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.target.style.boxShadow = '0 2px 8px rgba(1, 27, 81, 0.3)', e.target.style.transform = 'translateY(0)')}
                >
                  Edit
                </button>
                {pendingDeleteId === student._id ? (
                  <>
                    <button
                      onClick={() => handleConfirmDelete(student._id)}
                      style={{
                        flex: '1',
                        minWidth: '70px',
                        padding: '10px 12px',
                        backgroundColor: '#A51A21',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(165, 26, 33, 0.3)'
                      }}
                      onMouseEnter={(e) => (e.target.style.boxShadow = '0 4px 12px rgba(165, 26, 33, 0.4)', e.target.style.transform = 'translateY(-2px)')}
                      onMouseLeave={(e) => (e.target.style.boxShadow = '0 2px 8px rgba(165, 26, 33, 0.3)', e.target.style.transform = 'translateY(0)')}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={handleCancelDelete}
                      style={{
                        flex: '1',
                        minWidth: '70px',
                        padding: '10px 12px',
                        backgroundColor: '#f5f5f5',
                        color: '#666',
                        border: '2px solid #e0e0e0',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#e8e8e8', e.target.style.borderColor = '#999')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = '#f5f5f5', e.target.style.borderColor = '#e0e0e0')}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleInitiateDelete(student._id)}
                    style={{
                      flex: '1',
                      minWidth: '70px',
                      padding: '10px 12px',
                      backgroundColor: '#A51A21',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(165, 26, 33, 0.3)'
                    }}
                    onMouseEnter={(e) => (e.target.style.boxShadow = '0 4px 12px rgba(165, 26, 33, 0.4)', e.target.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => (e.target.style.boxShadow = '0 2px 8px rgba(165, 26, 33, 0.3)', e.target.style.transform = 'translateY(0)')}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentList;
