import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CourseList() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5001/courses')
          .then(response => {
            setCourses(response.data);
          })
          .catch(error => {
            console.error("There was an error fetching the courses", error);
          });
    }, []);

    return (
        <div>
            <h1>Course List</h1>
            <ul>
                {courses.length > 0 ? (
                    courses.map(course => (
                        <li key={course._id}>
                            <h2>{course.title}</h2>
                            <p>{course.description}</p>
                        </li>
                    ))
                ) : (
                    <li>No courses available</li>
                )}
            </ul>
        </div>
    );
}