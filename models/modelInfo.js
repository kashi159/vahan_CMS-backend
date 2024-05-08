const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

// Define the ModelInfo 
const ModelInfo = sequelize.define('ModelInfo', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    attributes: {
      type: DataTypes.JSON,
      allowNull: false
    }
  });

  module.exports = ModelInfo;