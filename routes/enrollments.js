const express = require('express');
const Enrollment = require('../backend/models/Enrollment');
const router = express.Router();

router.post('/', async (req, res) => {
    const { course, student } = req.body;
    try {
        const enrollment = new Enrollment({ course, student });
        await enrollment.save();
        res.status(201).send(enrollment);
    }   catch (error) {
        res.status(400).send({ error: 'Error enrolling in course' });
    }
});

router.get('/', async (req, res) => {
    try {
        const enrollments = await Enrollment.find().populate('course student');
        res.send(enrollments);
    }   catch (error) {
        res.status(400).send({ error: 'Error fetching enrollments' });
    }
});

module.exports = router;