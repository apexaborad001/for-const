'use strict';
module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.addColumn('leaderboards', 'winner_id', {
       type: Sequelize.SMALLINT
    });


  },
  down: async(queryInterface, Sequelize) => {
   
  }
};
