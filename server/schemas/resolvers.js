const { User, Restaurant } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("restaurants");
        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    saveRestaurant: async (parent, args, context) => {
      if (context.user) {
        const userNewRestaurant = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedRestaurants: args.input } },
          { new: true }
        );
        return userNewRestaurant;
      }
      throw new AuthenticationError(
        "You must be signed in to add a new restaurant!"
      );
    },
    removeRestaurant: async (parent, args, context) => {
      if (context.user) {
        const userRemoveRestaurant = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedRestaurants: { restaurantId: args.restaurantId } } },
          { new: true }
        );
        return userRemoveRestaurant;
      }
      throw new AuthenticationError(
        "You must be signed in to remove a restaurant"
      );
    },
  },
};

module.exports = resolvers;
