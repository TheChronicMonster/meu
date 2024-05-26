const Course = require('./models/Course');
const User = require('./models/User');

module.exports = {
  courses: async () => {
    return await Course.find().populate('instructor');
  },
  course: async ({ id }) => {
    return await Course.findById(id).populate('instructor');
  },
  userCourses: async (_, context) => {
    if (!context.user) throw new Error('Authentication required');
    return await Course.find({ instructor: context.user.id }).populate('instructor');
  },
  addCourse: async ({ title, description }, context) => {
    if (!context.user) throw new Error('Authentication required');
    const course = new Course({ title, description, instructor: context.user.id });
    await course.save();
    return course.populate('instructor');
  },
  updateCourse: async ({ id, title, description }, context) => {
    if (!context.user) throw new Error('Authentication required');
    const course = await Course.findById(id).populate('instructor');
    if (course.instructor._id.toString() !== context.user.id) throw new Error('Not authorized');
    course.title = title;
    course.description = description;
    await course.save();
    return course.populate('instructor');
  },
  deleteCourse: async ({ id }, context) => {
    if (!context.user) throw new Error('Authentication required');
    const course = await Course.findById(id).populate('instructor');
    if (course.instructor._id.toString() !== context.user.id) throw new Error('Not authorized');
    await course.remove();
    return course;
  }
};
