import React, { useState, useEffect } from 'react';

const CourseEnroller = ({ account, platformContract, tokenContract }) => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseId, setEnrolledCourseId] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseCount = await platformContract.methods.courseIdCounter().call();
        const fetchedCourses = [];
        for (let i = 0; i < courseCount; i++) {
          const course = await platformContract.methods.courses(i).call();
          fetchedCourses.push(course);
        }
        setCourses(fetchedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    if (platformContract) {
      fetchCourses();
    }
  }, [platformContract]);

  const handleEnroll = async (courseId) => {
    try {
      const registrationFee = await platformContract.methods.registrationFee().call();
      await tokenContract.methods.approve(platformContract.options.address, registrationFee)
        .send({ from: account });
      await platformContract.methods.enrollInCourse(courseId)
        .send({ from: account });
      setEnrolledCourseId(courseId);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  return (
    <div>
      <h2>Enroll in a Course</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>Creator: {course.creator}</p>
            {course.instructors.map((instructor, index) => (
              <p key={index}>Instructor: {instructor}</p>
            ))}
            <button onClick={() => handleEnroll(course.id)}>
              {enrolledCourseId === course.id ? 'Enrolled' : 'Enroll'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseEnroller;
