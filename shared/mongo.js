const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URL);

module.exports = {
  //full Connection
  db: null,

  //Collection connections
  posts: null,
  users: null,
  async connect() {
    //connection to databse
    await client.connect();
    console.log(
      "Connection to database is established",
      process.env.MONGODB_URL
    );
    //selecting the database
    this.db = client.db(process.env.MONGODB_NAME);
    console.log("Selected of database", process.env.MONGODB_NAME);

    //initialise connection

    this.posts = this.db.collection("posts");
    this.users = this.db.collection("users");
  },
};
