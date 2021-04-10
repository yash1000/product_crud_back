'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Students', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      department_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'departments',
          key: 'id',
        },
      },
      first_name: {
        type: Sequelize.STRING(50)
      },
      middle_name: {
        type: Sequelize.STRING(50)
      },
      last_name: {
        type: Sequelize.STRING(50)
      },
      city: {
        type: Sequelize.STRING(50)
      },
      address: {
        type: Sequelize.STRING(250)
      },
      email: {
        type: Sequelize.STRING(50)
      },
      mobile: {
        type: Sequelize.STRING(15)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Students');
  }
};
