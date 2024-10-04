'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // historys belongs to users (visitor)
      history.belongsTo(models.users, { foreignKey: 'visitor', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // historys belongs to users (visited)
      history.belongsTo(models.users, { foreignKey: 'visited', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }
  history.init({
    type: DataTypes.STRING,
    visitor: DataTypes.INTEGER,
    visited: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'history',
  });
  return history;
};