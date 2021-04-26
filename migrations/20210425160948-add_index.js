'use strict';
module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user_breaket_teams', 'id', {
      	type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true
    });
  
   await queryInterface.removeIndex('tournament_games', "tournament_games_team_1_id_team_2_id_game_id");
   await queryInterface.addIndex('tournament_games', ['team_1_id']);
   await queryInterface.addIndex('tournament_games', ['game_id']);
   await queryInterface.addIndex('tournament_games', ['team_2_id']);
   await queryInterface.addIndex('tournament_games', ['winner_id']);

   await queryInterface.addIndex('user_breaket_teams', ['user_bracket_id']);
   await queryInterface.addIndex('user_breaket_teams', ['game_id']);
   await queryInterface.addIndex('user_breaket_teams', ['team_1_id']);
   await queryInterface.addIndex('user_breaket_teams', ['team_2_id']);
   await queryInterface.addIndex('user_breaket_teams', ['winner_id']);

  },
  down: async(queryInterface, Sequelize) => {
   
  }
};
