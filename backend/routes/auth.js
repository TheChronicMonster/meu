const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const secret = 'your_jwt_secret';

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
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

      const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
      res.send({ token });
    });
  } catch (error) {
    res.status(400).send({ error: 'Error logging in' });
  }
});

module.exports = router;
