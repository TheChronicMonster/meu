const express = require('express');
const mongoose = require('mongoose');
const { createHandler } = require('graphql-http/lib/use/express');
const schema = require('./schema');
const resolvers = require('./resolvers');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/decedu', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to handle JSON requests
app.use(express.json());

// GraphQL endpoint
app.all('/graphql', createHandler({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
}));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
