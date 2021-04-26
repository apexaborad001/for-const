'use strict';
module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'firstName', {
       type: Sequelize.STRING(100)
    });
    
    await queryInterface.changeColumn('users', 'lastName', {
      type: Sequelize.STRING(100)
    });

    await queryInterface.changeColumn('users', 'userName', {
      type: Sequelize.STRING(100)
    });
    

    //await queryInterface.changeColumn('users', 'role', {
      //type: Sequelize.SMALLINT
    //});
    
    await queryInterface.changeColumn('users', 'phoneNumber', {
      type: Sequelize.STRING(20)
    });
    
    await queryInterface.changeColumn('users', 'countryCode', {
      type: Sequelize.STRING(5)
    });
     
    await queryInterface.changeColumn('users', 'stateId', {
      type: Sequelize.SMALLINT
    });

    await queryInterface.changeColumn('users', 'countryId', {
      type: Sequelize.SMALLINT
    });
    
    await queryInterface.changeColumn('roles', 'role', {
      type: Sequelize.STRING(50)
    });
    

    await queryInterface.changeColumn('user_images', 'image_type', {
      type: Sequelize.STRING(50)
    });

    
    await queryInterface.changeColumn('user_breakets', 'type', {
      type: Sequelize.STRING(10)
    });


    await queryInterface.changeColumn('user_breaket_teams', 'game_id', {
      type: Sequelize.SMALLINT
    });
    
    await queryInterface.changeColumn('user_breaket_teams', 'team_2_score', {
      type: Sequelize.SMALLINT
    });

    await queryInterface.changeColumn('user_breaket_teams', 'team_1_score', {
      type: Sequelize.SMALLINT
    });

    await queryInterface.changeColumn('user_breaket_teams', 'team_1_id', {
      type: Sequelize.SMALLINT
    });
    await queryInterface.changeColumn('user_breaket_teams', 'team_2_id', {
      type: Sequelize.SMALLINT
    });
    
    await queryInterface.changeColumn('user_breaket_teams', 'winner_id', {
      type: Sequelize.SMALLINT
    });

    await queryInterface.changeColumn('tournament_teams', 'team_id', {
      type: Sequelize.SMALLINT
    });


    await queryInterface.changeColumn('tournament_teams', 'current_score', {
      type: Sequelize.SMALLINT
    });

    await queryInterface.changeColumn('tournament_teams', 'name', {
      type: Sequelize.STRING(50)
    });
    

    await queryInterface.changeColumn('tournament_games', 'game_id', {
      type: Sequelize.SMALLINT
    });
    await queryInterface.changeColumn('tournament_games', 'team_1_id', {
      type: Sequelize.SMALLINT
    });
    
    await queryInterface.changeColumn('tournament_games', 'winner_id', {
      type: Sequelize.SMALLINT
    });
   
    await queryInterface.changeColumn('tournament_games', 'looser_id', {
      type: Sequelize.SMALLINT
    });

    await queryInterface.changeColumn('tournament_games', 'team_2_id', {
      type: Sequelize.SMALLINT
    });

    await queryInterface.changeColumn('tournament_games', 'bracket_id', {
      type: Sequelize.SMALLINT
    });

    await queryInterface.changeColumn('tournament_games', 'winner_score', {
      type: Sequelize.SMALLINT
    });

    await queryInterface.changeColumn('tournament_games', 'looser_score', {
      type: Sequelize.SMALLINT
    });

    await queryInterface.changeColumn('tournament_games', 'team2_score', {
      type: Sequelize.SMALLINT
    });
    await queryInterface.changeColumn('tournament_games', 'team1_score', {
      type: Sequelize.SMALLINT
    });
   
    await queryInterface.changeColumn('tournament_breakets', 'bracket_id', {
      type: Sequelize.SMALLINT
    });

    await queryInterface.changeColumn('winner_brackt_relation', 'bracket_id', {
      type: Sequelize.SMALLINT
    });

    await queryInterface.changeColumn('loser_brackt_relation', 'bracket_id', {
      type: Sequelize.SMALLINT
    });

    await queryInterface.changeColumn('winner_brackt_relation', 'nextbracketid', {
      type: Sequelize.SMALLINT
    });
    
    await queryInterface.changeColumn('loser_brackt_relation', 'nextbracketid', {
      type: Sequelize.SMALLINT
    });


    await queryInterface.changeColumn('winner_brackt_relation', 'point', {
      type: Sequelize.SMALLINT
    });

    await queryInterface.changeColumn('loser_brackt_relation', 'point', {
      type: Sequelize.SMALLINT
    });

    await queryInterface.removeColumn('tournament_teams', 'current_subseason_ids');
    await queryInterface.removeColumn('tournament_teams', 'league_id');
    await queryInterface.removeIndex('tournament_teams', "tournament_teams_team_id");
    await queryInterface.removeColumn('tournament_leagues', 'abbrev');
    await queryInterface.removeColumn('tournament_leagues', 'site_id');

    await queryInterface.removeColumn('tournament_games', 'location');
    await queryInterface.removeColumn('tournament_games', 'timezone');
    await queryInterface.addIndex('tournament_leagues', ['current_subseason_id']);
    await queryInterface.addIndex('tournament_breakets', ['subseason_id']);
    await queryInterface.changeColumn('tournament_leagues', 'name', {
      type: Sequelize.STRING(100)
    });
   // await queryInterface.changeColumn('tournament_leagues', 'league_id', {
     // type: Sequelize.SMALLINT
    //});


  },
  down: async(queryInterface, Sequelize) => {
   
  }
};
