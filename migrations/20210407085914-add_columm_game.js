'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tournament_games', 'team1_score', {
      	type: Sequelize.INTEGER,
        allowNull: true,
        after:"looser_score"
    });
    await queryInterface.addColumn('tournament_games', 'team2_score', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after:"looser_score"
   });

  },
  down: async (queryInterface, Sequelize) => {
  }
};
