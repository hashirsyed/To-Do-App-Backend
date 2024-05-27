"use strict";
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("tasks", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fkUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Todo', 'In Progress', 'Completed', 'Cancelled'),
        allowNull: false,
        defaultValue : "Todo"
      },
      priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High'),
        allowNull: false,
        defaultValue : "Medium"
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
  });
  Task.beforeCreate(async (task) => {
    task.dataValues.createdAt = moment().unix();
    task.dataValues.updatedAt = moment().unix();
  });
  Task.beforeUpdate(async (task) => {
    task.dataValues.updatedAt = moment().unix();
  });
  
  Task.associate = (models) => {
    Task.belongsTo(models.Users, {
      foreignKey: "fkUserId",
      as: "user",
    });}

  return Task;
};
