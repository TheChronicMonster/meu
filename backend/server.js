const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const resolvers = require('./resolvers');
const authRoutes = require('./routes/auth');

const app = express();

mongoose.connect('mongodb://localhost:27017/decedu', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(cors());

const secret = 'your_jwt_secret';

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, secret, (err, decoded) => {
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

app.use('/graphql', graphqlHTTP((req) => ({
  schema: schema,
  rootValue: { ...resolvers, user: req.user },
  graphiql: true,
})));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
