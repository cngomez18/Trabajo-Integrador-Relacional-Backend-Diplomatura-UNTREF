const { sequelize } = require('../conexion/database');
const { DataTypes } = require('sequelize');
const Genero = require('./genero')
const Contenido = require('./contenido')

const ContenidoGenero = sequelize.define(
  'ContenidoGenero',
  {
    contenido_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Contenido,
        key: 'id',
      },
    },
    genero_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Genero,
        key: 'id',
      },
    },
  },
  {
    tableName: 'contenido_genero',
    timestamps: false,
  }
);

Genero.belongsToMany(Contenido, { through: ContenidoGenero, foreignKey: 'genero_id' })
Contenido.belongsToMany(Genero, { through: ContenidoGenero, foreignKey: 'contenido_id' })

module.exports = { ContenidoGenero };
