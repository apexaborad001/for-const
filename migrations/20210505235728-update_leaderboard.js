'use strict';
module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.changeColumn('leaderboards', 'bracketType', {
       type: Sequelize.STRING(10)
    });
    
    await queryInterface.addColumn('leaderboards', 'rank', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after:"score"
  });

    
    await queryInterface.addIndex('leaderboards', ['userId']);
   // await queryInterface.changeColumn('tournament_leagues', 'league_id', {
     // type: Sequelize.SMALLINT
    //});


  },
  down: async(queryInterface, Sequelize) => {
   
  }
};
