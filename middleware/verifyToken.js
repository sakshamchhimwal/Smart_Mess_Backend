require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send("Unauthorized Acess");
  } else {
    try {
      const data = jwt.verify(token, process.env.JWT_KEY);
      req.user = data.user;
      next();
    } catch (err) {
      console.log(err);
      res.status(400).send("Unexpected Error");
    }
  }
};

module.exports = verifyToken;
