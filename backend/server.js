require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');

const app = express();

mongoose.connect('mongodb://localhost:27017/decedu', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(cors());

const secret = process.env.JWT_SECRET;

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token.split(' ')[1], secret, (err, decoded) => { // Assuming Bearer token
    if (err) {
      req.user = null;
    } else {
      req.user = decoded;
    }
    next();
  });
};

app.use(authMiddleware);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
