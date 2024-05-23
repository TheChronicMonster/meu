import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState('JP Miller');

  useEffect(() => {
    axios.get('http://localhost:5001/courses')
      .then(response => {
      setCourses(response.data);
    })
    .catch(error => {
      console.error("error fetching courses", error);
    });
  }, []);

  const enroll = (courseId) => {
    axios.post('http://localhost:5001/enroll', { courseId, user })
      .then(response => {
        if (response.data.success) {
          alert('Enrolled successfully');
        }
      })
      .catch(error => {
        console.error("error enrolling in course", error);
      });
  };

  return (
    <div className="App">
      <h1>Course List</h1>
      <ul>
        {courses.length > 0 ? (
          courses.map(course => (
            <li key={course.id}>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <button onClick={() => enroll(course.id)}>Enroll</button>
            </li>
          ))
        ) : (
          <li>No courses available</li>
        )}
      </ul>
    </div>
  );
}

export default App;