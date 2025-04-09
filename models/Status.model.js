const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Status = sequelize.define("status", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Status;
