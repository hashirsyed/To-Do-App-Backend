// const { secret } = require("../constants");
const { Users } = require("../models");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log("Users : ",Users)
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(409).send("User Not Found");
    }
    const token = req.header("Authorization");
    if (!token) {
      return res.status(404).send("Token is required");
    }
    const decodedToken = await jwt.verify(token, "JWTSECRET");
    if (!decodedToken) {
      return res.status(404).send("Invalid Token");
    }
    if (user.id !== decodedToken.id) {
      return res
        .status(404)
        .send("You are not authorized to use this resource");
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};
