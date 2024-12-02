import { createRequire } from 'module';
module.exports = (sequelize, DataTypes) => {
  class chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // chats belongs to users (user_id1)
      chat.belongsTo(models.users, { foreignKey: 'user_id1', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // chats belongs to users (user_id2)
      chat.belongsTo(models.users, { foreignKey: 'user_id2', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // chats has many messages
      chat.hasMany(models.messages, { foreignKey: 'chat_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }
  chat.init({
    user_id1: DataTypes.INTEGER,
    user_id2: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'chat',
  });
  return chat;
};