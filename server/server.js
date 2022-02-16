const express = require("express");
const path = require("path");
const db = require("./config/connection");
const { ApolloServer } = require("apollo-server-express");
const { authMiddleware } = require("./utils/auth");
const { typeDefs, resolvers } = require("./schemas");
const axios = require("axios");
require("dotenv").config();
//console.log(process.env) // remove this after you've confirmed it working
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//apollo server
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: authMiddleware,
// });
// console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
// server.applyMiddleware({ app });

// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/build")));
// }

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });

app.get("/", (req, res) => {
  let data = async ()=> {
    axios.get("https://api.yelp.com/v3/businesses/search?location=chicago", {
      headers:
        "Bearer <Your_yelp_key>",
    })
      .then(
        (response = () => {
          console.log(response);
        })
      )
      .catch(
        (error = () => {
          console.log(error);
        })
      );
  };
  data();
});

db.once("open", () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
