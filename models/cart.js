'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cart.hasOne(models.Product, {
        sourceKey: 'product_id',
        foreignKey: 'id',
      })
    }
  };
  Cart.init({
    product_id: DataTypes.INTEGER(),
    qty: DataTypes.INTEGER(),
    user_id: DataTypes.INTEGER(),
  }, {
    sequelize,
    modelName: 'Cart',
    freezeTableName: true,
  });
  return Cart;
};