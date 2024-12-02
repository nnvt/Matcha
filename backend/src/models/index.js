import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Sequelize, DataTypes } from 'sequelize';
import process from 'process';
import config from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

const db = {};

// Get the configuration for the current environment
const dbConfig = config[env];

// Ensure that dialect is defined
if (!dbConfig.dialect) {
  throw new Error('Dialect must be explicitly provided in the configuration.');
}

// Sequelize initialization
let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port || 3306,
  });
}

// Load all models in the models directory asynchronously
const loadModels = async () => {
  const files = fs.readdirSync(__dirname).filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  });

  for (const file of files) {
    const modelPath = path.join(__dirname, file);
    const modelModule = await import(pathToFileURL(modelPath).href);
    const model = modelModule.default(sequelize, DataTypes);
    db[model.name] = model;
  }

  // Associate models if applicable
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

// Load models
await loadModels();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
