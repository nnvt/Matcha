'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class images extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      images.belongsTo(models.users, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }
  images.init({
    url: DataTypes.STRING,
    profile: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'images',
  });
  return images;
};