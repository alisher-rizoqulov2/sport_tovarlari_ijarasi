const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Clients = require("./clients.model");
const Products = require("./Products.model");
const Status = require("./Status.model");

const Contracts = sequelize.define("contracts", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});
Contracts.belongsTo(Clients);
Clients.hasMany(Contracts);
Contracts.belongsTo(Products);
Products.hasMany(Contracts);
Contracts.belongsTo(Status);
Status.hasMany(Contracts);

module.exports = Contracts;
