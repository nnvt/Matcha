'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // messages belongs to chats
      messages.belongsTo(models.chat, { foreignKey: 'chat_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // messages belongs to users
      messages.belongsTo(models.users, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }
  messages.init({
    massage: DataTypes.STRING,
    seen: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    chat_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'messages',
  });
  return messages;
};