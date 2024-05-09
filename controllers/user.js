const config = require("../config");
const { Users } = require("../models");
const { generateErrorInstance } = require("../utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  signUp: async function (req, res) {
    try {
      const { name, email, password, profileUrl } = req.body;
      if (!name && !email && !password && !profileUrl) {
        throw generateErrorInstance({
          status: 404,
          message: "Required fields cannot be empty",
        });
      }

      let user = await Users.findOne({
        where: {
          email,
        },
      });

      if(user){
        return res.status(409).send("User already exists with this email");
      }
      
      const hashedPassword = await bcrypt.hash(password,12)
      user = await Users.create({
        name,
        email,
        password:hashedPassword,
        profileUrl,
      });
      user = await user.toJSON();
      const token = jwt.sign(user, config.get("jwt_secret"), {
        expiresIn: "1d",
      });
      console.log(token)
      
      res.status(201).send({user,token});
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw generateErrorInstance({
          status: 400,
          message: "Required fields can't be empty",
        });
      }

      let user = await Users.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw generateErrorInstance({
          status: 404,
          message: "User not found",
        });
      }

      const passwordMatched = await bcrypt.compare(password, user.password);
      if (!passwordMatched) {
        throw generateErrorInstance({
          status: 401,
          message: "Invalid Password",
        });
      }

      user = user.toJSON();
      delete user.password;

      const token = jwt.sign(user, config.get("jwt_secret"), {
        expiresIn: "1d",
      });

      return res.status(200).send({ user, token });
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .send(err.message || "Something went wrong!");
    }
  },
};
