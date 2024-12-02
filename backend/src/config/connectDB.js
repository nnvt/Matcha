import { Sequelize } from 'sequelize';
import path from 'path';
import config from './config.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('connection has been established successfully');
    } catch (error) {
        console.log('unable to connect', error);
    }
}

export default connectDB;