const Course = require('./models/Course');

module.exports = {
  courses: async () => {
    return await Course.find();
  },
  course: async ({ id }) => {
    return await Course.findById(id);
  },
  addCourse: async ({ title, description }) => {
    const course = new Course({ title, description });
    await course.save();
    return course;
  },
  updateCourse: async ({ id, title, description }) => {
    return await Course.findByIdAndUpdate(id, { title, description }, { new: true });
  },
  deleteCourse: async ({ id }) => {
    return await Course.findByIdAndDelete(id);
  }
};
