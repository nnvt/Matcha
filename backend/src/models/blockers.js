'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blockers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // blockers belongs to users (blocker)
      blockers.belongsTo(models.users, { foreignKey: 'blocker', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // blockers belongs to users (blocked)
      blockers.belongsTo(models.users, { foreignKey: 'blocked', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }
  blockers.init({
    blocker: DataTypes.INTEGER,
    blocked: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'blockers',
  });
  return blockers;
};