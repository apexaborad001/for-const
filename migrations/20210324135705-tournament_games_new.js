'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tournament_games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      game_id: {
        type: Sequelize.INTEGER
      },
      team_1_id: {
        type: Sequelize.INTEGER
      },
      team_2_id: {
        type: Sequelize.INTEGER
      },
      winner_id: {
        type: Sequelize.INTEGER
      },
      looser_id: {
        type: Sequelize.INTEGER
      },
      round: {
        type: Sequelize.TINYINT
      },
      position: {
        type: Sequelize.TINYINT
      },
      bracket_id: {
        type: Sequelize.INTEGER
      },
      game_start_time: {
        allowNull: true,
        type: Sequelize.DATE
      },
      game_end_time: {
        allowNull: true,
        type: Sequelize.DATE
      },      
      location: {
        type: Sequelize.STRING
      },
      timezone: {
        allowNull: true,
        type: Sequelize.STRING(100)
      },
      winner_score: {
        type: Sequelize.INTEGER
      },
      looser_score: {
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
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tournament_games');
  }
};