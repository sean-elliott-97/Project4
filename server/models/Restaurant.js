const { Schema } = require("mongoose");

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedRestaurants` array in User.js
const restaurantSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
    },
    url: {
      type: String,
    },
    review_count: {
      type: Number,
    },
    rating: {
      type: String,
    },
    price: {
      type: String,
    },
    location: [
      {
        address1: {
          type: String,
        },
      },
      {
        city: {
          type: String,
        },
      },
      {
        zip_code: {
          type: String,
        },
      },
      {
        country: {
          type: String,
        },
      },
      {
        state: {
          type: String,
        },
      },
    ],
    phone: {
      type: String,
    },
    display_phone: {
      type: String,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);
restaurantSchema.virtual("fullAddress").get(function () {
  return (
    this.location.address1 +
    ", " +
    this.location.city +
    " " +
    this.location.state +
    " " +
    this.location.zip_code
  );
});
module.exports = restaurantSchema;
