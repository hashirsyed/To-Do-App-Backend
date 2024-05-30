"use strict";
const {DataTypes} =require("sequelize")

const table = "tasks";


module.exports = {
  up: async function (queryInterface) {
    await queryInterface.createTable(table, {
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

  },
  down: async function (queryInterface) {
    await queryInterface.dropTable(table);
  },
};