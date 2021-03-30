'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('countries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING(3),
        uniqueKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(55),
        allowNull: false
      },
      continent: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      region: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      code2: {
        type: Sequelize.STRING(2),
        uniqueKey: true,
        allowNull: false
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('countries');
  }
};