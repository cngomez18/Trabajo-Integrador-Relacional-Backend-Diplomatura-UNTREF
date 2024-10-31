
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('trailerflix', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = { sequelize };
