const express = require('express');
const jwt = require('jwt-simple');
const User = require('../backend/models/User');
const config = require('../config');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).send({ message: 'User created successfully' });
    }   catch (error) {
        res.status(400).send({ error: 'Error creating user' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).send({ error: 'Invalid username or password' });

        user.comparePassword(password, (err, isMatch) => {
            if (!isMatch) return res.status(401).send({ error: 'Invalid username or password' });

            const token = jwt.encode({ id: user._id }, config.secret);
            res.send({ token });
        });
    }   catch (error) {
        res.status(400).send({ error: 'Error logging in' });
    }
});

module.exports = router;