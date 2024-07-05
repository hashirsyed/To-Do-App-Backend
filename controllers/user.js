// const config = require("../config");
// const { secret } = require("../constants");
const config = require("../config");
const { Users, Tasks } = require("../models");
const { generateErrorInstance } = require("../utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

module.exports = {
  signUp: async function (req, res) {
    try {
      const { name, email, password, profileUrl } = req.body;
      if (!name && !email && !password) {
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

      if (user) {
        throw generateErrorInstance({
          status: 409,
          message: "User already exist with this email",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      user = await Users.create({
        name,
        email,
        password: hashedPassword,
        profileUrl,
      });
      user = await user.toJSON();
      const token = jwt.sign(user, config.get("jwt_secret"), {
        expiresIn: "365d",
      });

      res.status(201).send({ user, token });
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

      user = await user.toJSON();
      delete user.password;

      const token = jwt.sign(user, config.get("jwt_secret"), {
        expiresIn: "365d",
      });

      return res.status(200).send({ user, token });
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .send(err.message || "Something went wrong!");
    }
  },
  edit: async function (req, res) {
    try {
      console.log(req.file);
      const { name } = req.body;
      const { userId } = req.params;

      if (!userId) {
        throw generateErrorInstance({
          status: 404,
          message: "User ID is required",
        });
      }

      let user = await Users.findByPk(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }
      let profileUrl;
      if (req.file) {
        profileUrl = `/Images/${req.file.filename}`;
      }
      console.log(req.file);
      await user.update({
        name,
        profileUrl: profileUrl,
      });

      res.status(200).send({ message: "User updated successfully", user });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  getMyProfile: async (req, res) => {
    try {
      let { userId } = req.params;
      let user = await Users.findByPk(userId);
      res.status(201).send(user);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  statusTasksCount: async (req, res) => {
    try {
      const { status } = req.query;
      const { userId } = req.params;

      let tasks = await Tasks.count({
        where: {
          fkUserId: userId,
          status: status,
        },
      });

      return res.status(200).send({ count: tasks });
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .send(err.message || "Something went wrong!");
    }
  },
  taskCount: async (req, res) => {
    try {
      const { userId } = req.params;

      let tasks = await Tasks.count({
        where: {
          fkUserId: userId,
        },
      });

      return res.status(200).send({ count: tasks });
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .send(err.message || "Something went wrong!");
    }
  },
  deleteImage: async function (req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        throw generateErrorInstance({
          status: 404,
          message: "User ID is required",
        });
      }

      let user = await Users.findByPk(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }

      user.profileUrl = null;
      await user.save();

      res.status(200).send({ message: "Profile Image deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  google: async function (req, res) {
    try {
      const { googleAuthorizationToken, flow } = req.body;

      let payload;
      if (flow === "implicit") {
        const tokenInfo = await client.getTokenInfo(
          googleAuthorizationToken
        );
        payload = tokenInfo;
      } else {
        const ticket = await client.verifyIdToken({
          idToken: googleAuthorizationToken,
          audience: config.get("clientId"),
        });
        payload = ticket.payload;
        console.log(ticket);
      }

      const googleSub = payload.sub;
      const email = payload.email;
      const picture = payload.picture;
      const name = payload.name;

      let user = await Users.findOne({
        where: {
          email,
        },
      });
      if (user) {
        user = await user.update({
          googleSub,
        });
      } else if(!user){
        user = await Users.create({
          name,
          email,
          profileUrl: picture,
        });
      }
      user = await user.toJSON();
      const token = jwt.sign(user, config.get("jwt_secret"), {
        expiresIn: "365d",
      });
      res.status(201).send({ user, token });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
};
