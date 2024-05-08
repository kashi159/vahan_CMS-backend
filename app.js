const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const sequelize = require('./util/database');
const ModelInfo = require('./models/modelInfo');
const defineEntityModel = require('./services/defineModel');

const entitiesRoute = require('./routes/entitiesRoute');
const entriesRoute = require('./routes/entriesRoute');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes Handling
app.use(entitiesRoute);
app.use('/entities',entriesRoute);


sequelize.sync().then(async () => {
  const modelsInfo = await ModelInfo.findAll();

  for (const info of modelsInfo) {
    await defineEntityModel(info.name, info.attributes);
  }

  app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
  });
}).catch(err => {
  console.error('Unable to synchronize models with the database:', err);
});
