'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.belongsToMany(models.tags, { through: models.usertags, foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // users has many Images
      users.hasMany(models.images, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // Self-association for blockers
      users.hasMany(models.blockers, { as: 'Blocker', foreignKey: 'blocker', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
      users.hasMany(models.blockers, { as: 'Blocked', foreignKey: 'blocked', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // users has many History entries
      users.hasMany(models.history, { as: 'Visitor', foreignKey: 'visitor', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
      users.hasMany(models.history, { as: 'Visited', foreignKey: 'visited', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // users has many Matchers (self-association)
      users.hasMany(models.matchers, { foreignKey: 'matcher', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
      users.hasMany(models.matchers, { foreignKey: 'matched', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // users has many Notifications
      users.hasMany(models.notifications, { as: 'ToUser', foreignKey: 'to_user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
      users.hasMany(models.notifications, { as: 'FromUser', foreignKey: 'from_user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }
  
  users.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.STRING,
    bio: DataTypes.STRING,
    looking: DataTypes.STRING,
    birthday: DataTypes.DATE,
    age: DataTypes.INTEGER,
    fame: DataTypes.FLOAT(5, 2),
    lat: DataTypes.DOUBLE,
    lag: DataTypes.DOUBLE,
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    verified: DataTypes.TINYINT(1),
    status: DataTypes.DATE,
    reports: DataTypes.INTEGER,
    aToken: DataTypes.STRING,
    rToken: DataTypes.STRING,
    googleid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });

  return users;
};
