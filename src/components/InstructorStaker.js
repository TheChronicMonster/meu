import React, { useState, useEffect } from 'react';

const InstructorStaker = ({ account, platformContract }) => {
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [isStaked, setIsStaked] = useState(false);

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

  const handleStake = async (e) => {
    e.preventDefault();
    try {
      await platformContract.methods.stakeAsInstructor(courseId)
        .send({ from: account });
      setIsStaked(true);
    } catch (error) {
      console.error('Error staking as instructor:', error);
    }
  };

  return (
    <div>
      <h2>Stake as Instructor</h2>
      <form onSubmit={handleStake}>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">Select a Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        <button type="submit">Stake as Instructor</button>
      </form>
      {isStaked && <p>You have successfully staked as an instructor for course ID: {courseId}</p>}
    </div>
  );
};

export default InstructorStaker;
