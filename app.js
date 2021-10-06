const express = require("express");
const { config } = require("dotenv").config();

const cors = require("cors");

const jwt = require("jsonwebtoken");

const mongo = require("./shared/mongo");

const postsRoutes = require("./routes/posts.routes");
const usersRoutes = require("./routes/users.routes");
const middleware = require("./shared/middleware");
const PORT = process.env.PORT || 5000;
const app = express();
//MongoDB connections
async function loadApp() {
  try {
    await mongo.connect();

    app.use(cors());
    app.use(express.json());
    app.use("/users", usersRoutes);

    app.use(middleware.authCheck);
    app.use("/posts", postsRoutes);

    //Logging middleware
    app.use(middleware.loginMiddleware);

    app.listen(PORT, () => {
      console.log(`Server started At ${process.env.PORT}`);
    });
  } catch (err) {
    console.log("Error starting server", err);
  }
}

loadApp();
