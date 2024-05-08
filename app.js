// Node.js Backend
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Connect to MySQL/PostgreSQL database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.USER, process.env.PASSWORD, {
  dialect: 'mysql', 
  host: 'localhost',
  port: process.env.PORT,
});

// Define the ModelInfo Sequelize model
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

// Define Entity model dynamically
const defineEntityModel = async (entityName, attributes) => {
  const modelAttributes = {};
  
  // Convert attributes to Sequelize DataTypes
  for (const [attributeName, attributeType] of Object.entries(attributes)) {
    modelAttributes[attributeName] = DataTypes[attributeType.toUpperCase()];
  }

  // Define model with the provided attributes
  const model = sequelize.define(entityName, modelAttributes, {
    primaryKey: 'id', // Specify the primary key inside the options object
    timestamps: false // Disable timestamps if not needed
  });
  
  // Sync model with database to create table if not exists
  await model.sync();
  
  return model;
};

// Route to get list of all entities
app.get('/entities', async (req, res) => {
    try {
      const tableNames = await sequelize.getQueryInterface().showAllTables();
  
      const entities = tableNames.filter(tableName => tableName !== 'SequelizeMeta');
  
      res.json({ entities });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Create Entity route
app.post('/entity', async (req, res) => {
  const { name, attributes } = req.body;
  try {
    const model = await defineEntityModel(name, attributes);
    await ModelInfo.create({ name, attributes });
    res.status(201).json({ message: `Entity ${name} created successfully!`, model });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CRUD routes for entities (Create, Read, Update, Delete)

// Create route
app.post('/entities/:entityName', async (req, res) => {
    const entityName = req.params.entityName;
    const { attributes } = req.body;
    console.log(entityName, attributes);
    try {
      // Check if entity model exists
      const model = sequelize.models[entityName];
      if (!model) {
        return res.status(404).json({ error: `Entity ${entityName} not found` });
      }
  
      // Create entity
      const createdEntity = await model.create(attributes);
      res.status(201).json(createdEntity);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  // Read route (Get all entities)
  app.get('/entities/:entityName', async (req, res) => {
    const entityName = req.params.entityName;
  
    try {
      // Check if entity model exists
      const model = sequelize.models[entityName];
      if (!model) {
        return res.status(404).json({ error: `Entity ${entityName} not found` });
      }
  
      // Fetch all entities
      const entities = await model.findAll();
      res.json(entities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update route
  app.put('/entities/:entityName/:id', async (req, res) => {
    const entityName = req.params.entityName;
    const id = req.params.id;
    const updates = req.body;
  
    try {
      // Check if entity model exists
      const model = sequelize.models[entityName];
      if (!model) {
        return res.status(404).json({ error: `Entity ${entityName} not found` });
      }
  
      // Find entity by id and update
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
  app.delete('/entities/:entityName/:id', async (req, res) => {
    const entityName = req.params.entityName;
    const id = req.params.id;
  
    try {
      // Check if entity model exists
      const model = sequelize.models[entityName];
      if (!model) {
        return res.status(404).json({ error: `Entity ${entityName} not found` });
      }
  
      // Delete entity by id
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



sequelize.sync().then(async () => {
  // Query the database to retrieve information about dynamically created models
  const modelsInfo = await ModelInfo.findAll();

  // Define Sequelize models dynamically based on retrieved information
  for (const info of modelsInfo) {
    await defineEntityModel(info.name, info.attributes);
  }

  // Start the server
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}).catch(err => {
  console.error('Unable to synchronize models with the database:', err);
});
