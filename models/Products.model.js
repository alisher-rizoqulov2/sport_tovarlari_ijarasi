const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Categories = require("./Categories.model");
const Owners = require("./Owners.model");

const Products = sequelize.define("products", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price_per_day: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  photo: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  description: {
    type: DataTypes.TEXT,
  },
});
Products.belongsTo(Categories);
Categories.hasMany(Products);
Products.belongsTo(Owners);
Owners.hasMany(Products);
module.exports = Products;
