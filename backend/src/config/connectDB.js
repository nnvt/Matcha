const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('jwt', 'root', '1234buonluon', {
    host: 'localhost',
    dialect: 'mysql',
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