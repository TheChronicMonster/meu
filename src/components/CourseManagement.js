import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      title
      description
      instructor {
        id
        username
      }
    }
  }
`;

const ADD_COURSE = gql`
  mutation AddCourse($title: String!, $description: String!) {
    addCourse(title: $title, description: $description) {
      id
      title
      description
      instructor {
        id
        username
      }
    }
  }
`;

const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $title: String!, $description: String!) {
    updateCourse(id: $id, title: $title, description: $description) {
      id
      title
      description
      instructor {
        id
        username
      }
    }
  }
`;

const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id) {
      id
    }
  }
`;

const CourseManagement = () => {
  const { loading, error, data, refetch } = useQuery(GET_COURSES);
  const [addCourse] = useMutation(ADD_COURSE, {
    refetchQueries: [{ query: GET_COURSES }]
  });
  const [updateCourse] = useMutation(UPDATE_COURSE, {
    refetchQueries: [{ query: GET_COURSES }]
  });
  const [deleteCourse] = useMutation(DELETE_COURSE, {
    refetchQueries: [{ query: GET_COURSES }]
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    if (error) {
      console.error('Error fetching courses:', error);
      console.error('Error details:', error.networkError?.result || error.graphQLErrors || error.message);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCourse) {
      updateCourse({ variables: { id: editingCourse.id, title, description } });
    } else {
      addCourse({ variables: { title, description } });
    }
    setTitle('');
    setDescription('');
    setEditingCourse(null);
  };

  const handleEdit = (course) => {
    setTitle(course.title);
    setDescription(course.description);
    setEditingCourse(course);
  };

  const handleDelete = (id) => {
    deleteCourse({ variables: { id } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

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
        {data.courses.map((course) => (
          <li key={course.id}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>Instructor: {course.instructor.username}</p>
            {course.instructor.id === localStorage.getItem('userId') && (
              <>
                <button onClick={() => handleEdit(course)}>Edit</button>
                <button onClick={() => handleDelete(course.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseManagement;
