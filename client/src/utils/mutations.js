import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveRestaurant($input: savedRestaurant!) {
    saveRestaurant(input: $input) {
      _id
      username
      email
      restaurantCount
      savedRestaurants {
        # _id
        restaurantId
        authors
        image
        link
        title
        description
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeRestaurant($restaurantId: String!) {
    removeRestaurant(restaurantId: $restaurantId) {
      _id
      username
      email
      restaurantCount
      savedRestaurants {
        # _id
        restaurantId
        authors
        image
        link
        title
        description
      }
    }
  }
`;
