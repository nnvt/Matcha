'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      lastname: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING(10),
        allowNull: true,
        defaultValue: null,
      },
      bio: {
        type: Sequelize.STRING(500),
        allowNull: true,
        defaultValue: null,
      },
      looking: {
        type: Sequelize.STRING(10),
        allowNull: true,
        defaultValue: null,
      },
      birthday: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      lat: {
        type: Sequelize.DOUBLE(11, 8),
        allowNull: true,
        defaultValue: null,
      },
      lag: {
        type: Sequelize.DOUBLE(11, 8),
        allowNull: true,
        defaultValue: null,
      },
      country: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      city: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      fame: {
        type: Sequelize.FLOAT(5, 2),
        allowNull: true,
        defaultValue: 0,
      },
      verified: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      reports: {
        type: Sequelize.INTEGER(2),
        allowNull: true,
        defaultValue: 0,
      },
      aToken: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      rToken: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      googleid: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW') // Set default value to current timestamp
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null // Set default value to null
      }
    });
    await queryInterface.addConstraint('users', {
      fields: ['email', 'username'],
      type: 'unique',
      name: 'uk_email_username'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};