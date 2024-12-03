'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // notifications belongs to users (to_user)
      notifications.belongsTo(models.users, { as: 'ToUser', foreignKey: 'to_user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // notifications belongs to users (from_user)
      notifications.belongsTo(models.users, { as: 'FromUser', foreignKey: 'from_user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // notifications belongs to chats
      notifications.belongsTo(models.chat, { foreignKey: 'chat_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }
  notifications.init({
    content: DataTypes.STRING,
    seen: DataTypes.INTEGER,
    to_user: DataTypes.INTEGER,
    from_user: DataTypes.INTEGER,
    chat_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'notifications',
  });
  return notifications;
};