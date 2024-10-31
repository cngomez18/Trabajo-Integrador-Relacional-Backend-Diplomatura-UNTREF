const { sequelize } = require('../conexion/database');
const { DataTypes } = require('sequelize');

const Genero = sequelize.define(
  'Genero',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    genre_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: 'genero',
    timestamps: false,
  }
);
module.exports = { Genero };