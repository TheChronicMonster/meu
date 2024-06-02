import React, { useState, useEffect } from 'react';

const CourseCompleter = ({ account, platformContract }) => {
  const [courseId, setCourseId] = useState('');
  const [studentAddress, setStudentAddress] = useState('');
  const [courses, setCourses] = useState([]);

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

  const handleAttestCompletion = async (e) => {
    e.preventDefault();
    try {
      await platformContract.methods.attestCourseCompletion(courseId, studentAddress)
        .send({ from: account });
      setCourseId('');
      setStudentAddress('');
    } catch (error) {
      console.error('Error attesting course completion:', error);
    }
  };

  return (
    <div>
      <h2>Attest Course Completion</h2>
      <form onSubmit={handleAttestCompletion}>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">Select a Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Student Address"
          value={studentAddress}
          onChange={(e) => setStudentAddress(e.target.value)}
        />
        <button type="submit">Attest Completion</button>
      </form>
    </div>
  );
};

export default CourseCompleter;
