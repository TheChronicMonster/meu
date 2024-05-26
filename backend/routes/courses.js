const express = require('express');
const Course = require('../backend/models/Course');
const router = express.Router();

router.post('/', async (req, res) => {
    const { title, description, instructor } = req.body;
    try {
        const course = new Course({ title, description, instructor });
        await course.save();
        res.status(201).send(course);
    }   catch (error) {
        res.status(400).send({ error: 'Error creating course' });
    }
});

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor');
        res.send(courses);
    }   catch (error) {
        res.status(400).send({ error: 'Error fetching courses' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(course);
    }   catch (error) {
        res.status(400).send({ error: 'Error updating course' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.send({ message: 'Course deleted successfully' });
    }   catch (error) {
        res.status(400).send({ error: 'Error deleting course' });
    }
});

module.exports = router;