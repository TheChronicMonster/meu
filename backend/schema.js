const { buildSchema } = require('graphql');

module.exports = buildSchema(`
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
