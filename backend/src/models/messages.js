import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Messages belongs to chats
      Messages.belongsTo(models.chat, { foreignKey: 'chat_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // Messages belongs to users
      Messages.belongsTo(models.users, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }

  Messages.init({
    message: DataTypes.STRING,
    seen: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    chat_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'messages',
  });

  return Messages;
};
