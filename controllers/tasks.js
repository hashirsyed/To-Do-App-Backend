const { Tasks } = require("../models");
const { generateErrorInstance } = require("../utils");
module.exports = {
  create: async function (req, res) {
    try {
      const { title, description, status, priority } = req.body;
      const { userId } = req.params;
      if (!title && !description && !status && !priority && !userId) {
        throw generateErrorInstance({
          status: 404,
          message: "Required fields cannot be empty",
        });
      }

      let task = await Tasks.create({
        title,
        description,
        fkUserId: userId,
        status,
        priority,
      });
      task = await task.toJSON();

      res.status(201).send({ message: "Task added successfully", task });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
};
