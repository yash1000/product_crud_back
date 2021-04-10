'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.hasOne(models.Department, {
        sourceKey: 'department_id',
        foreignKey: 'id',
      })
    }
  };
  Student.init({
    department_id: DataTypes.INTEGER,
    first_name: DataTypes.STRING(50),
    middle_name: DataTypes.STRING(50),
    last_name: DataTypes.STRING(50),
    city: DataTypes.STRING(50),
    address: DataTypes.STRING(250),
    email: DataTypes.STRING(50),
    mobile: DataTypes.STRING(15)
  }, {
    sequelize,
    modelName: 'Student',
  });
  return Student;
};
