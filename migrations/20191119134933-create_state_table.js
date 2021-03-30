'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('states', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING(5),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      countryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'countries', // name of Target model
          key: 'id', // key in Target model that we're referencing
        }
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
    await queryInterface.dropTable('states');
  }
};
