const jwt = require("jsonwebtoken");

const middleware = {
  authCheck(req, res, next) {
    const token = req.headers["auth_token"];
    if (token) {
      try {
        req.user = jwt.verify(token, process.env.JWT_PASSWORD);
        next();
      } catch (err) {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  },
  loginMiddleware(req, res, next) {
    console.log("Logging Middleware called !!!");
    next();
  },
};

module.exports = middleware;
