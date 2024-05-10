const express = require('express');
const router = express.Router();

const pluralize = require('pluralize');
const sequelize = require('../util/database');
const  defineEntityModel  = require('../services/defineModel');
const ModelInfo = require('../models/modelInfo');

// Route to get list of all entities
router.get('/entities', async (req, res) => {
  try {
      const tableNames = await sequelize.getQueryInterface().showAllTables();

      const entities = {};
      for (const tableName of tableNames) {
          if (tableName !== 'modelinfos') {
              const singularTableName = pluralize.singular(tableName);
              const columns = await sequelize.getQueryInterface().describeTable(tableName);
              entities[singularTableName] = columns;
          }
      }

      res.json({ entities });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});



// Create Entity route
router.post('/entity', async (req, res) => {
  const { name, attributes } = req.body;
  const newName = name.toLowerCase();
  try {
    const model = await defineEntityModel(name, attributes);
    await ModelInfo.create({ name: newName, attributes });
    const modelsInfo = await ModelInfo.findAll();

  for (const info of modelsInfo) {
    await defineEntityModel(info.name, info.attributes);
  }
    res.status(201).json({ message: `Entity ${name} created successfully!`, model });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;