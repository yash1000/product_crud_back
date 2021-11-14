'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(50)
      },
      role: {
        type: Sequelize.ENUM(['USER', 'SHOP'])
      },
      email: {
        type: Sequelize.STRING(250)
      },
      userName: {
        type: Sequelize.STRING(250)
      },
      password: {
        type: Sequelize.STRING()
      },
      language: {
        type: Sequelize.STRING(15)
      },
      currency: {
        type: Sequelize.STRING(15)
      },
      active: {
        type: Sequelize.BOOLEAN()
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
    await queryInterface.dropTable('Users');
  }
};
