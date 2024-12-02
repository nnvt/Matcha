import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Notifications belongs to users (to_user)
      Notifications.belongsTo(models.users, { as: 'ToUser', foreignKey: 'to_user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // Notifications belongs to users (from_user)
      Notifications.belongsTo(models.users, { as: 'FromUser', foreignKey: 'from_user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // Notifications belongs to chats
      Notifications.belongsTo(models.chat, { foreignKey: 'chat_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }

  Notifications.init({
    content: DataTypes.STRING,
    seen: DataTypes.INTEGER,
    to_user: DataTypes.INTEGER,
    from_user: DataTypes.INTEGER,
    chat_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'notifications',
  });

  return Notifications;
};
