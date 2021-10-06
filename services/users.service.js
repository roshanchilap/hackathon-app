const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const db = require("../shared/mongo");
const schema = require("../shared/schema");
const { registerSchema, loginSchema } = require("../shared/schema");

const service = {
  async register(req, res) {
    {
      try {
        let { error, value } = await registerSchema.validate(req.body);

        if (error)
          return res.status(400).send({
            erorr: "Validation failed",
            message: error.details[0].message,
          });
        //check email exists
        const user = await db.users.findOne({ email: value.email });
        if (user) return res.status(400).send("User already exists");
        // generate salt
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(value.password, salt);

        await db.users.insertOne(value);
        res.send({ message: "User register sucessfully" });
      } catch (err) {
        res.sendStatus(500).send("user already exists", err);
        console.log("Error registering user");
      }
    }
  },
  async login(req, res) {
    try {
      let { error, value } = await loginSchema.validate(req.body);

      if (error)
        return res.status(400).send({
          erorr: "Validation failed",
          message: error.details[0].message,
        });

      const user = await db.users.findOne({ email: value.email });
      if (!user)
        return res
          .status(400)
          .send("You have not yet registred, please sign up");

      // check password

      const isValidPass = await bcrypt.compare(value.password, user.password);

      if (!isValidPass)
        return res.status(401).send("Please enter correct password");

      //generate token

      const authToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_PASSWORD
      );
      res.send({ auth_token: authToken });
    } catch (err) {
      res.sendStatus(500);
      console.log("Error login users");
    }
  },
};

module.exports = service;
