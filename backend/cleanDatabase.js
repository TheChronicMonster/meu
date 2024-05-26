const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/decedu', { useNewUrlParser: true, useUnifiedTopology: true });

async function cleanDatabase() {
  const courses = await Course.find().populate('instructor');
  for (let course of courses) {
    if (!course.instructor) {
      // Set a default instructor or handle the orphaned course as needed
      const defaultUser = await User.findOne(); // Fetch a default user
      if (defaultUser) {
        course.instructor = defaultUser._id;
        await course.save();
        console.log(`Updated course ${course.title} with default instructor`);
      } else {
        console.log(`Course ${course.title} has no instructor and no default user found`);
      }
    }
  }
  mongoose.disconnect();
}

cleanDatabase();
