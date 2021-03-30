'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {    
    const result = await queryInterface.sequelize.query('update tournament_teams set division_teamid = MOD(team_id, 16)');
    const result2 = await queryInterface.sequelize.query('update tournament_teams set division_teamid = 16 where division_teamid = 0');
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
