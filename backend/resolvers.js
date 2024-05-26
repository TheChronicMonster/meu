const Course = require('./models/Course');

module.exports = {
  courses: async () => {
    return await Course.find();
  },
  course: async ({ id }) => {
    return await Course.findById(id);
  },
  addCourse: async ({ title, description }, context) => {
    if (!context.user) throw new Error('Authentication required');
    const course = new Course({ title, description, instructor: context.user.id });
    await course.save();
    return course;
  },
  updateCourse: async ({ id, title, description }, context) => {
    if (!context.user) throw new Error('Authentication required');
    const course = await Course.findById(id);
    if (course.instructor.toString() !== context.user.id) throw new Error('Not authorized');
    course.title = title;
    course.description = description;
    await course.save();
    return course;
  },
  deleteCourse: async ({ id }, context) => {
    if (!context.user) throw new Error('Authentication required');
    const course = await Course.findById(id);
    if (course.instructor.toString() !== context.user.id) throw new Error('Not authorized');
    await course.remove();
    return course;
  }
};
