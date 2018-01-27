const Sequelize = require('sequelize');
const databaseConfig = require('../config').database;

module.exports = new Sequelize(databaseConfig);
