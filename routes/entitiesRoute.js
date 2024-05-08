const express = require('express');
const router = express.Router();
const sequelize = require('../util/database');
const  defineEntityModel  = require('../services/defineModel');
const ModelInfo = require('../models/modelInfo');

// Route to get list of all entities
router.get('/entities', async (req, res) => {
    try {
      const tableNames = await sequelize.getQueryInterface().showAllTables();
  
      const entities = tableNames.filter(tableName => tableName !== 'SequelizeMeta');
  
      res.json({ entities });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Create Entity route
router.post('/entity', async (req, res) => {
  const { name, attributes } = req.body;
  try {
    const model = await defineEntityModel(name, attributes);
    await ModelInfo.create({ name, attributes });
    res.status(201).json({ message: `Entity ${name} created successfully!`, model });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;