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
  categoryId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: "categories",
      key: "id",
    },
  },
  ownerId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: "owners",
      key: "id",
    },
  },
});

Products.belongsTo(Categories, { foreignKey: "categoryId" });
Categories.hasMany(Products, { foreignKey: "categoryId" });
Products.belongsTo(Owners, { foreignKey: "ownerId" });
Owners.hasMany(Products, { foreignKey: "ownerId" });

module.exports = Products;
