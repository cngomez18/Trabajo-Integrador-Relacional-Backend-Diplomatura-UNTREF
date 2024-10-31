const { sequelize } = require('../conexion/database');
const { DataTypes } = require('sequelize');

const Actor = sequelize.define(
  'Actor',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'actor',
    timestamps: false,
  }
);

module.exports = { Actor };
