import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Matchers extends Model {
    static associate(models) {
      // Matchers belongs to users (matcher)
      Matchers.belongsTo(models.users, { foreignKey: 'matcher', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

      // Matchers belongs to users (matched)
      Matchers.belongsTo(models.users, { foreignKey: 'matched', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }

  Matchers.init({
    matcher: DataTypes.INTEGER,
    matched: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Matchers',
  });

  return Matchers;
};
