import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      title
      description
    }
  }
`;

const ADD_COURSE = gql`
  mutation AddCourse($title: String!, $description: String!) {
    addCourse(title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

const CourseList = () => {
  const { loading, error, data } = useQuery(GET_COURSES);
  const [addCourse] = useMutation(ADD_COURSE);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddCourse = () => {
    addCourse({
      variables: { title, description },
      refetchQueries: [{ query: GET_COURSES }]
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h1>Course List</h1>
      <ul>
        {data.courses.length > 0 ? (
          data.courses.map(course => (
            <li key={course.id}>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
            </li>
          ))
        ) : (
          <li>No courses available</li>
        )}
      </ul>
      <div>
        <h2>Add Course</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleAddCourse}>Add Course</button>
      </div>
    </div>
  );
};

export default CourseList;
