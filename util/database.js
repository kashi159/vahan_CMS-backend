const Sequelize = require('sequelize');
require('dotenv').config();

// Connect to MySQL/PostgreSQL database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.USER, process.env.PASSWORD, {
    dialect: 'mysql', 
    host: process.env.HOST,
    port: process.env.PORT,
  });

  module.exports = sequelize;