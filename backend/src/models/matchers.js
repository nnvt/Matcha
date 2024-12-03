'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class matchers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // matchers belongs to users (matcher)
      matchers.belongsTo(models.users, { foreignKey: 'matcher', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // matchers belongs to users (matched)
      matchers.belongsTo(models.users, { foreignKey: 'matched', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }
  matchers.init({
    matchers: DataTypes.INTEGER,
    matched: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'matchers',
  });
  return matchers;
};