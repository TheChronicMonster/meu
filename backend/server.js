const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql'); // Import graphqlHTTP
const { buildSchema } = require('graphql');
const schema = require('./schema');
const resolvers = require('./resolvers');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/decedu', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to handle JSON requests
app.use(express.json());

// Use CORS middleware
app.use(cors());

// Define GraphQL schema and resolvers
const graphQLSchema = buildSchema(`
  type Course {
    id: ID!
    title: String!
    description: String!
  }

  type Query {
    courses: [Course]
    course(id: ID!): Course
  }

  type Mutation {
    addCourse(title: String!, description: String!): Course
    updateCourse(id: ID!, title: String, description: String): Course
    deleteCourse(id: ID!): Course
  }
`);

const root = resolvers;

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: graphQLSchema,
  rootValue: root,
  graphiql: true, // Enable GraphiQL
}));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
