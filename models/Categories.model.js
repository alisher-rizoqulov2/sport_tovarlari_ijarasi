const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Categories = sequelize.define("categories", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

module.exports = Categories;
