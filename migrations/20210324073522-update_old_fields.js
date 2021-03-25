'use strict';
module.exports = {
  up: async(queryInterface, Sequelize) => {   
    await queryInterface.dropTable('tournament_games');
    await queryInterface.dropTable('tournament_breakets');
    await queryInterface.dropTable('user_breaket_teams'); 
    await queryInterface.dropTable('tournament_teams');   
  },
  down: async(queryInterface, Sequelize) => {
    
  }
};
