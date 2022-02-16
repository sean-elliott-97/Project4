const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    me: User
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveRestaurant(input: savedRestaurant!): User
    removeRestaurant(restaurantId: String!): User
  }
  type User {
    _id: ID
    username: String
    email: String
    restaurantCount: Int
    savedRestaurants: [Restaurant]
  }

  type Restaurant {
    _id: ID!
    RestaurantId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  input savedRestaurant {
    authors: [String]
    description: String
    title: String
    restaurant: String
    image: String
    link: String
  }
  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;
