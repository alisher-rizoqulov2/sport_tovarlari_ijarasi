const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Products = require("./Products.model");

const Discounts = sequelize.define("discounts", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  discount_present: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});
Discounts.belongsTo(Products);
Products.hasMany(Discounts);
module.exports = Discounts;
