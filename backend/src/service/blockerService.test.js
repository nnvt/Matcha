'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class users_tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // usertags belongs to users
      users_tags.belongsTo(models.users, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // usertags belongs to tags
      users_tags.belongsTo(models.tags, { foreignKey: 'tag_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }

  users_tags.init({
    tag_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users_tags',
  });

  return users_tags;
};
