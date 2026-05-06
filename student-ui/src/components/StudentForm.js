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
    <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px', backgroundColor: editingStudent ? '#fffbea' : '#fff' }}>
      <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
      
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>First Name * </label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            placeholder="Enter first name"
            required
            style={{ display: 'block', marginTop: '5px', width: '100%', padding: '10px', boxSizing: 'border-box', fontSize: '14px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Last Name </label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            placeholder="Enter last name"
            style={{ display: 'block', marginTop: '5px', width: '100%', padding: '10px', boxSizing: 'border-box', fontSize: '14px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Course * </label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="Enter course name"
            required
            style={{ display: 'block', marginTop: '5px', width: '100%', padding: '10px', boxSizing: 'border-box', fontSize: '14px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 30px',
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Saving...' : editingStudent ? 'Update Student' : 'Add Student'}
          </button>

          {editingStudent && (
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: '12px 30px',
                backgroundColor: '#999',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
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
