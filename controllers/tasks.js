const { Tasks } = require("../models");
const { generateErrorInstance } = require("../utils");
module.exports = {
  create: async function (req, res) {
    try {
      const { title, description, status, priority } = req.body;
      const { userId } = req.params;
      if (!title && !description && !priority && !userId) {
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
  edit: async function (req, res) {
    try {
      const { title, description, status, priority } = req.body;
      const { taskId } = req.params;
  
      if (!taskId) {
        throw generateErrorInstance({
          status: 404,
          message: "Task ID is required",
        });
      }
  
      let task = await Tasks.findByPk(taskId);
  
      if (!task) {
        return res.status(404).send("Task not found");
      }
  
      await task.update({
        title,
        description,
        status,
        priority,
      });
  
      res.status(200).send({ message: "Task updated successfully", task });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  delete : async function (req, res) {
    try {
      const { taskId } = req.params;
  
      if (!taskId) {
        throw generateErrorInstance({
          status: 404,
          message: "Task ID is required",
        });
      }
  
      let task = await Tasks.findByPk(taskId);
  
      if (!task) {
        return res.status(404).send("Task not found");
      }
  
      await task.destroy({
        where : {
          id : taskId
        }
      });
  
      res.status(200).send({ message: "Task deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message || "Something went wrong!");
    }
  },
  
};
