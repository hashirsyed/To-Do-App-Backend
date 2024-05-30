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
  getAll: async function (req, res) {
    try {
      const { userId } = req.params;
      const { status } = req.query;

      const validStatuses = ["In Progress", "Todo", "Completed", "Cancelled"];

      const whereClause = { fkUserId: userId };
      if (validStatuses.includes(status)) {
        whereClause.status = status;
      }

      let task = await Tasks.findAll({
        where: whereClause,
      });
      res.status(201).send(task);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
};
