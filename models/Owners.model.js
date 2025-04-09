const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Owners = sequelize.define("owners", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  is_creator: {
    type: DataTypes.BOOLEAN,
    defaultValue:true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refresh_token: {
    type: DataTypes.STRING,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  activation_link: {
    type: DataTypes.STRING(255),
  },
});

module.exports = Owners;
