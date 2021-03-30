'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('loser_brackt_relation', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bracket_id: {
        type: Sequelize.INTEGER
      },
      round: {
        type: Sequelize.TINYINT
      },
      nextbracketid: {
        type: Sequelize.INTEGER
      },
      nextround: {
        type: Sequelize.TINYINT
      },
      point: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
    await queryInterface.addIndex('loser_brackt_relation', ['bracket_id']);

  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('loser_brackt_relation');
  }
};