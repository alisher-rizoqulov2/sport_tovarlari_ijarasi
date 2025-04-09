const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Contracts = require("./Contracts.model");

const Payments = sequelize.define("payments", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  payment_status: {
    type: DataTypes.STRING,
  },
  transaction_code: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed", "failed"),
    defaultValue: "pending",
  },
});
Payments.belongsTo(Contracts);
Contracts.hasMany(Payments);
module.exports = Payments;
