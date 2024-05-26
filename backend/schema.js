const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type User {
    id: ID!
    username: String!
    courses: [Course!]
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    instructor: User
  }

  type Query {
    courses: [Course]
    course(id: ID!): Course
    userCourses: [Course]
  }

  type Mutation {
    addCourse(title: String!, description: String!): Course
    updateCourse(id: ID!, title: String, description: String): Course
    deleteCourse(id: ID!): Course
  }
`);

module.exports = schema;
