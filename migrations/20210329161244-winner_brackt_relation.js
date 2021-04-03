'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('winner_brackt_relation', {
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
      position_relation: {
        type: Sequelize.STRING
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
    await queryInterface.addIndex('winner_brackt_relation', ['bracket_id']);

  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('winner_brackt_relation');
  }
};