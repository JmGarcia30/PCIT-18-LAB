import React, { useState, useEffect } from 'react';

function StudentList({ refreshTrigger, setEditingStudent }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const itemsPerPage = 6;

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

  // Handle initiate delete with confirmation UI
  const handleInitiateDelete = (id) => {
    setDeleteConfirmationModal(id);
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
      setDeleteConfirmationModal(null);
      setCurrentPage(1);
      setSuccessMessage('Student deleted successfully');
      
      // Auto-dismiss after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setDeleteErrorMessage('Error deleting student: ' + err.message);
      setDeleteConfirmationModal(null);
      
      // Auto-dismiss after 3 seconds
      setTimeout(() => setDeleteErrorMessage(''), 3000);
      console.error('Error:', err);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setDeleteConfirmationModal(null);
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

      {deleteConfirmationModal && (
        <>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease'
          }} onClick={handleCancelDelete}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '400px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              animation: 'slideUp 0.3s ease',
              textAlign: 'center'
            }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#333',
                margin: '0 0 12px 0'
              }}>
                Delete Student?
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: '0 0 24px 0',
                lineHeight: '1.5'
              }}>
                Are you sure you want to delete this student? This action cannot be undone.
              </p>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={handleCancelDelete}
                  style={{
                    padding: '12px 32px',
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#e8e8e8', e.target.style.borderColor = '#999')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#f5f5f5', e.target.style.borderColor = '#e0e0e0')}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmDelete(deleteConfirmationModal)}
                  style={{
                    padding: '12px 32px',
                    backgroundColor: '#A51A21',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(165, 26, 33, 0.3)'
                  }}
                  onMouseEnter={(e) => (e.target.style.boxShadow = '0 6px 16px rgba(165, 26, 33, 0.4)', e.target.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.target.style.boxShadow = '0 4px 12px rgba(165, 26, 33, 0.3)', e.target.style.transform = 'translateY(0)')}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
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
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <div>
          <p style={{ color: '#666', fontSize: '14px', margin: '0' }}>
            Total Students: <strong style={{ color: '#011B51', fontSize: '16px' }}>{students.length}</strong>
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            whiteSpace: 'nowrap'
          }}>
            Filter by Course:
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '10px 12px',
              fontSize: '14px',
              border: '2px solid #e0e0e0',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#333',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              minWidth: '160px'
            }}
            onMouseEnter={(e) => (e.target.style.borderColor = '#011B51')}
            onMouseLeave={(e) => (e.target.style.borderColor = '#e0e0e0')}
            onFocus={(e) => (e.target.style.borderColor = '#011B51', e.target.style.boxShadow = '0 0 0 3px rgba(1, 27, 81, 0.1)')}
            onBlur={(e) => (e.target.style.borderColor = '#e0e0e0', e.target.style.boxShadow = 'none')}
          >
            <option value="all">All Courses</option>
            {(() => {
              const uniqueCourses = [...new Set(students.map(s => s.course).filter(Boolean))];
              return uniqueCourses.sort().map(course => (
                <option key={course} value={course}>
                  {course}
                </option>
              ));
            })()}
          </select>
        </div>
      </div>
      
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
        <>
          {(() => {
            const filteredStudents = selectedCourse === 'all' 
              ? students 
              : students.filter(s => s.course === selectedCourse);
            
            const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedStudents = filteredStudents.slice(startIndex, endIndex);
            
            return (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '20px'
                }}>
                  {paginatedStudents.map(student => (
            <div key={student._id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)', e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)')}
            >
              <div style={{ marginBottom: '16px' }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#999',
                  margin: '0 0 4px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  First Name
                </p>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#011B51',
                  margin: '0'
                }}>
                  {student.firstname}
                </p>
              </div>

              {student.middlename && (
                <div style={{ marginBottom: '16px' }}>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#999',
                    margin: '0 0 4px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Middle Name
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#333',
                    margin: '0'
                  }}>
                    {student.middlename}
                  </p>
                </div>
              )}

              {student.lastname && (
                <div style={{ marginBottom: '16px' }}>
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

              <div style={{ marginBottom: '16px' }}>
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
                  margin: '0'
                }}>
                  {student.course}
                </p>
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
              </div>
            </div>
                  ))}
                </div>
                
                {filteredStudents.length === 0 && (
                  <div style={{
                    backgroundColor: '#f5f5f5',
                    border: '2px dashed #ddd',
                    borderRadius: '8px',
                    padding: '40px',
                    textAlign: 'center',
                    color: '#999',
                    marginTop: '20px'
                  }}>
                    <p style={{ fontSize: '16px', margin: '0' }}>No students found for the selected course.</p>
                  </div>
                )}
                
                {totalPages > 1 && filteredStudents.length > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '32px',
                    flexWrap: 'wrap'
                  }}>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: currentPage === 1 ? '#e0e0e0' : '#011B51',
                        color: currentPage === 1 ? '#999' : 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== 1) {
                          e.target.style.boxShadow = '0 4px 12px rgba(1, 27, 81, 0.4)';
                          e.target.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.boxShadow = 'none';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{
                          minWidth: '40px',
                          padding: '10px 12px',
                          backgroundColor: page === currentPage ? '#011B51' : '#f5f5f5',
                          color: page === currentPage ? 'white' : '#333',
                          border: page === currentPage ? 'none' : '2px solid #e0e0e0',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: page === currentPage ? '700' : '600',
                          transition: 'all 0.3s ease',
                          boxShadow: page === currentPage ? '0 2px 8px rgba(1, 27, 81, 0.3)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (page !== currentPage) {
                            e.target.style.backgroundColor = '#e8e8e8';
                            e.target.style.borderColor = '#999';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (page !== currentPage) {
                            e.target.style.backgroundColor = '#f5f5f5';
                            e.target.style.borderColor = '#e0e0e0';
                          }
                        }}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: currentPage === totalPages ? '#e0e0e0' : '#011B51',
                        color: currentPage === totalPages ? '#999' : 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== totalPages) {
                          e.target.style.boxShadow = '0 4px 12px rgba(1, 27, 81, 0.4)';
                          e.target.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.boxShadow = 'none';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      Next
                    </button>
                    
                    <div style={{
                      marginLeft: '8px',
                      fontSize: '14px',
                      color: '#666',
                      fontWeight: '500'
                    }}>
                      Page {currentPage} of {totalPages}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </>
      )}
    </div>
  );
}

export default StudentList;
