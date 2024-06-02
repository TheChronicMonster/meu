import React, { useState } from 'react';

const CourseCreator = ({ account, platformContract, fetchCourses }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await platformContract.methods.createCourse(title, description)
        .send({ from: account });
      setTitle('');
      setDescription('');
      fetchCourses(); // Refetch courses to update the list
    } catch (error) {
      console.error('Error creating course:', error);
      setError('Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create a New Course</h2>
      <form onSubmit={handleCreateCourse}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Course'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CourseCreator;
