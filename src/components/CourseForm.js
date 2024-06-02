import React, { useState } from 'react';

const CourseForm = ({ account, platformContract, fetchCourses, editingCourse }) => {
  const [title, setTitle] = useState(editingCourse ? editingCourse.title : '');
  const [description, setDescription] = useState(editingCourse ? editingCourse.description : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await platformContract.methods.updateCourse(editingCourse.id, title, description)
          .send({ from: account });
      } else {
        await platformContract.methods.createCourse(title, description)
          .send({ from: account });
      }
      setTitle('');
      setDescription('');
      fetchCourses(); // Refetch courses to update the list
    } catch (error) {
      console.error('Error submitting course:', error);
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
    </div>
  );
};

export default CourseForm;
