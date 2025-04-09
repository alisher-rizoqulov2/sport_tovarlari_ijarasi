const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Clients = require("./clients.model");
const Products = require("./Products.model");

const Reviews = sequelize.define("reviews", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
  },
});
Reviews.belongsTo(Clients);
Clients.hasMany(Reviews);
Reviews.belongsTo(Products);
Products.hasMany(Reviews);
module.exports = Reviews;
