const express = require('express');
const router = express.Router();
const sequelize = require('../util/database');

// CRUD routes for entities (Create, Read, Update, Delete)

// Create route
router.post('/:entityName', async (req, res) => {
    const entityName = req.params.entityName;
    const { attributes } = req.body;
    console.log( entityName, attributes);
    try {
      const model = sequelize.models[entityName];
      console.log(model);
      if (!model) {
        return res.status(404).json({ error: `Entity ${entityName} not found` });
      }
  
      const createdEntity = await model.create(attributes);
      res.status(201).json(createdEntity);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  // Read route (Get all entities)
  router.get('/:entityName', async (req, res) => {
    const entityName = req.params.entityName;
  
    try {
      const model = sequelize.models[entityName];
      if (!model) {
        return res.status(404).json({ error: `Entity ${entityName} not found` });
      }

      const entities = await model.findAll();
      res.json(entities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // get Route(single entry)
  router.get('/:entityName/:id', async (req, res) => {
    const entityName = req.params.entityName;
    const id = req.params.id;
  
    try {
      const model = sequelize.models[entityName];
      if (!model) {
        return res.status(404).json({ error: `Entity ${entityName} not found` });
      }

      const entities = await model.findOne({
        where: { id }
      });
      res.json(entities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update route
  router.put('/:entityName/:id', async (req, res) => {
    const entityName = req.params.entityName;
    const id = req.params.id;
    const updates = req.body;
  
    try {
      const model = sequelize.models[entityName];
      if (!model) {
        return res.status(404).json({ error: `Entity ${entityName} not found` });
      }
  
      const [updatedRowsCount] = await model.update(updates, {
        where: { id }
      });
  
      if (updatedRowsCount === 0) {
        return res.status(404).json({ error: `Entity with id ${id} not found` });
      }
  
      res.json({ message: `Entity with id ${id} updated successfully` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Delete route
  router.delete('/:entityName/:id', async (req, res) => {
    const entityName = req.params.entityName;
    const id = req.params.id;
  
    try {
      const model = sequelize.models[entityName];
      if (!model) {
        return res.status(404).json({ error: `Entity ${entityName} not found` });
      }
  
      const deletedRowsCount = await model.destroy({
        where: { id }
      });
  
      if (deletedRowsCount === 0) {
        return res.status(404).json({ error: `Entity with id ${id} not found` });
      }
  
      res.json({ message: `Entity with id ${id} deleted successfully` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;