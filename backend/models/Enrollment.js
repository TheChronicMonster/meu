const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);