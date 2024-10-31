const { sequelize } = require('../conexion/database');
const { DataTypes } = require('sequelize');
const Actor = require('./actor')
const Contenido = require('./contenido')

const ContenidoActor = sequelize.define(
  'ContenidoActor',
  {
    contenido_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Contenido,  
        key: 'id',
      },
    },
    actor_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Actor,
        key: 'id',
      },
    },
  },
  {
    tableName: 'contenido_actor',
    timestamps: false,
  }
);

Actor.belongsToMany(Contenido, { through: ContenidoActor, foreignKey: 'actor_id' })
Contenido.belongsToMany(Actor, { through: ContenidoActor, foreignKey: 'contenido_id' })

module.exports = { ContenidoActor };
