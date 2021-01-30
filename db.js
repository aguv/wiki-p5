const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://postgres@localhost/wiki', {
  logging: false,
  dialect: 'postgres'
});

module.exports = sequelize;