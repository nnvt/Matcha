const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('jwt', 'root', '1234buonluon', {
    host: 'localhost',
    dialect: 'mysql'
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