'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
      name: DataTypes.STRING(50),
      role: DataTypes.ENUM(['USER', 'SHOP']),
      userName: DataTypes.STRING(50),
      password: DataTypes.STRING(50),
      language: DataTypes.STRING(250),
      currency: DataTypes.STRING(50),
      email: DataTypes.STRING(50),
      active: DataTypes.BOOLEAN()
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};