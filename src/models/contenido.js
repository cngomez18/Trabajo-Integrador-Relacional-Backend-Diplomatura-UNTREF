
const { sequelize } = require('../conexion/database');
const { DataTypes } = require('sequelize');

const Contenido = sequelize.define(
  'Contenido',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    poster: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.ENUM('Serie', 'Película'),
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resumen: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    temporadas: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    trailer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'contenido',
    timestamps: false,
  }
);

module.exports = { Contenido };