'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Cart, {
        sourceKey: 'product_id',
        foreignKey: 'id',
      })
    }
  };
  Product.init({
    product_name: DataTypes.STRING(50),
    category: DataTypes.STRING(50),
    sub_category: DataTypes.STRING(50),
    description: DataTypes.STRING(250),
    image: DataTypes.STRING(50),
    status: DataTypes.BOOLEAN(),
    price: DataTypes.INTEGER(),
    qty: DataTypes.INTEGER()
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};