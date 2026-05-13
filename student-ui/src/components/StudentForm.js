import React, { useState, useEffect } from 'react';

function StudentForm({ onStudentAdded, editingStudent, setEditingStudent }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    course: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Populate form when editing student changes
  useEffect(() => {
    if (editingStudent) {
      setFormData({
        firstname: editingStudent.firstname || '',
        lastname: editingStudent.lastname || '',
        course: editingStudent.course || ''
      });
    } else {
      setFormData({
        firstname: '',
        lastname: '',
        course: ''
      });
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.firstname || !formData.course) {
        setError('First name and course are required');
        setLoading(false);
        return;
      }

      if (editingStudent) {
        // UPDATE existing student (PUT request)
        const response = await fetch(`/api/students/${editingStudent._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Failed to update student');
        }

        await response.json();
        onStudentAdded();
      } else {
        // CREATE new student (POST request)
        const response = await fetch('/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Failed to add student');
        }

        await response.json();
        onStudentAdded();
      }
    } catch (err) {
      setError(err.message || 'Error saving student');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingStudent(null);
    setFormData({
      firstname: '',
      lastname: '',
      course: ''
    });
  };

  return (
    <div style={{
      backgroundColor: editingStudent ? 'rgba(1, 27, 81, 0.05)' : '#fff',
      borderLeft: editingStudent ? '4px solid #011B51' : 'none',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '8px',
        color: '#333',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        {editingStudent ? 'Edit Student' : 'Add New Student'}
      </h2>
      <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>
        {editingStudent ? 'Update student information' : 'Register a new student in the system'}
      </p>
      
      {error && <p style={{ 
        color: '#A51A21', 
        fontWeight: '600', 
        backgroundColor: '#fff5f5',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '20px',
        fontSize: '14px'
      }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            fontWeight: '600', 
            color: '#333',
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px'
          }}>
            First Name <span style={{ color: '#011B51' }}>*</span>
          </label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            placeholder="Enter first name"
            required
            style={{
              width: '100%',
              padding: '12px 14px',
              fontSize: '14px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontFamily: 'inherit',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#011B51'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            fontWeight: '600', 
            color: '#333',
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px'
          }}>
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            placeholder="Enter last name"
            style={{
              width: '100%',
              padding: '12px 14px',
              fontSize: '14px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontFamily: 'inherit',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#011B51'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        <div style={{ marginBottom: '28px' }}>
          <label style={{ 
            fontWeight: '600', 
            color: '#333',
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px'
          }}>
            Course <span style={{ color: '#011B51' }}>*</span>
          </label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="Enter course name"
            required
            style={{
              width: '100%',
              padding: '12px 14px',
              fontSize: '14px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontFamily: 'inherit',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#011B51'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 32px',
              backgroundColor: loading ? '#b0bec5' : '#011B51',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(1, 27, 81, 0.3)',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => !loading && (e.target.style.boxShadow = '0 6px 16px rgba(1, 27, 81, 0.4)', e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !loading && (e.target.style.boxShadow = '0 4px 12px rgba(1, 27, 81, 0.3)', e.target.style.transform = 'translateY(0)')}
          >
            {loading ? 'Saving...' : editingStudent ? 'Update Student' : 'Add Student'}
          </button>

          {editingStudent && (
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: '12px 32px',
                backgroundColor: '#f5f5f5',
                color: '#666',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#e8e8e8', e.target.style.borderColor = '#999')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#f5f5f5', e.target.style.borderColor = '#e0e0e0')}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default StudentForm;
