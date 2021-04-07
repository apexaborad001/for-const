'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tournament_leagues', 
    [
      {
          "league_id": 202101,
          "name": "Men's League",
          "current_subseason_id": 202101,
          "site_id": 11953,
          "gender": "male",
          "abbrev": "Mens",
          createdAt: new Date(),
          updatedAt: new Date(),
       
      },
      {
          "league_id": 202102,
          "name": "Survivor Cup",
          "current_subseason_id": 202102,
          "site_id": 11953,
          "gender": "male",
          "abbrev": "Women",
          createdAt: new Date(),
          updatedAt: new Date(),       
       },
       {
        "league_id": 202103,
        "name": "Challenge Cup",
        "current_subseason_id": 202103,
        "site_id": 11953,
        "gender": "male",
        "abbrev": "Mens",
        createdAt: new Date(),
        updatedAt: new Date()   
      },
      {
        "league_id": 202104,
        "name": "Champions Cup",
        "current_subseason_id": 202104,
        "site_id": 11953,
        "gender": "male",
        "abbrev": "Mens",
        createdAt: new Date(),
        updatedAt: new Date()   
      },
      {
        "league_id": 202105,
        "name": "Women's League",
        "current_subseason_id": 202105,
        "site_id": 11953,
        "gender": "female",
        "abbrev": "Mens",
        createdAt: new Date(),
        updatedAt: new Date()   
      },
     {
        "league_id": 202106,
        "name": "Survivor Cup",
        "current_subseason_id": 202106,
        "site_id": 11953,
        "gender": "female",
        "abbrev": "Women",
        createdAt: new Date(),
        updatedAt: new Date(),       
     },
     {
      "league_id": 202107,
      "name": "Challenge Cup",
      "current_subseason_id": 202107,
      "site_id": 11953,
      "gender": "female",
      "abbrev": "",
      createdAt: new Date(),
      updatedAt: new Date()   
    },
    {
      "league_id": 202108,
      "name": "Champions Cup",
      "current_subseason_id": 202108,
      "site_id": 11953,
      "gender": "female",
      "abbrev": "Mens",
      createdAt: new Date(),
      updatedAt: new Date()   
    }
  ]
  );

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tournament_leagues', null, {});

  }
};
