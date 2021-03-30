'use strict';
module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.addColumn('tournament_breakets', 'bracket_position', {
      	type: Sequelize.STRING(100),
        allowNull: true,
        after:"subseason_id"
    });
    await queryInterface.addColumn('tournament_teams', 'division_teamid', {
      type: Sequelize.TINYINT,
      allowNull: true,
      after:"league_id"
   });  
   await queryInterface.addIndex('tournament_games', ['team_1_id', 'team_2_id', 'game_id']);
   await queryInterface.addIndex('tournament_teams', ['team_id']);
   await queryInterface.addIndex('tournament_breakets', ['bracket_id', 'subseason_id']);
   await queryInterface.addIndex('tournament_leagues', ['league_id']);
  },
  down: async(queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tournament_breakets', 'bracket_position');
    await queryInterface.removeColumn('tournament_teams', 'division_teamid');
  }
};
