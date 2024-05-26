import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const ADD_COURSE = gql`
  mutation AddCourse($title: String!, $description: String!) {
    addCourse(title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

const CourseForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [addCourse] = useMutation(ADD_COURSE);

  const handleSubmit = (e) => {
    e.preventDefault();
    addCourse({ variables: { title, description } });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a New Course</h2>
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
      <button type="submit">Create Course</button>
    </form>
  );
};

export default CourseForm;
