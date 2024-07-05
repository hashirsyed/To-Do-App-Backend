"use strict";
const {DataTypes} =require("sequelize")

const table = "users";


module.exports = {
  up: async function (queryInterface) {
    await queryInterface.changeColumn(table,"password",{
      allowNull: true,
      type: DataTypes.STRING,
    }
    );

  },
  down: async function (queryInterface) {
    await queryInterface.changeColumn(table);
  },
};