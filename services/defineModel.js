const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');


const defineEntityModel = async (entityName, attributes) => {
    const modelAttributes = {};
    // console.log(attributes);
    for (const [attributeName, attributeType] of Object.entries(attributes)) {
      modelAttributes[attributeName] = DataTypes[attributeType.toUpperCase()];
    }
  
    const model = sequelize.define(entityName, modelAttributes, {
      primaryKey: 'id', 
      timestamps: false 
    });
    
    await model.sync();
    
    return model;
  };

  module.exports = defineEntityModel;