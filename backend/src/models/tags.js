import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Tags belongs to many users through usertags
      Tags.belongsToMany(models.users, { through: models.usertags, foreignKey: 'tag_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }

  Tags.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tags',
  });

  return Tags;
};
