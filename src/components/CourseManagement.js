import React, { useState, useEffect } from 'react';

const CourseManagement = ({ account, platformContract, courses, fetchCourses }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await platformContract.methods.createCourse(title, description)
        .send({ from: account });
      setTitle('');
      setDescription('');
      setEditingCourse(null);
      fetchCourses(); // Refetch courses to update the list
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleEditCourse = async (courseId, newTitle, newDescription) => {
    try {
      await platformContract.methods.updateCourse(courseId, newTitle, newDescription)
        .send({ from: account });
      fetchCourses();
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await platformContract.methods.deleteCourse(courseId)
        .send({ from: account });
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleEdit = (course) => {
    setTitle(course.title);
    setDescription(course.description);
    setEditingCourse(course);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCourse) {
      handleEditCourse(editingCourse.id, title, description);
    } else {
      handleCreateCourse(e);
    }
  };

  return (
    <div>
      <h2>{editingCourse ? 'Edit Course' : 'Create a New Course'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">{editingCourse ? 'Update Course' : 'Create Course'}</button>
      </form>

      <h2>All Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>Creator: {course.creator}</p>
            {course.instructors.map((instructor, index) => (
              <p key={index}>Instructor: {instructor}</p>
            ))}
            {course.creator === account && (
              <>
                <button onClick={() => handleEdit(course)}>Edit</button>
                <button onClick={() => handleDeleteCourse(course.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseManagement;
