const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Clients = sequelize.define("clients", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  birth_date: {
    type: DataTypes.DATE,
  },
  is_creator: {
    type: DataTypes.BOOLEAN,
    defaultValue:true,
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
  passport_number: {
    type: DataTypes.STRING,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
  },
  photo: {
    type: DataTypes.STRING,
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

module.exports = Clients;
