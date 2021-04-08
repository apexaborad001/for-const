'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tournament_games', [
      {
        "game_id": 65,
        "team_1_id": 33,
        "team_2_id": 40,
        "round": 1,
        "position": 1,
        "bracket_id": 15,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 66,
        "team_1_id": 37,
        "team_2_id": 36,
        "round": 1,
        "position": 2,
        "bracket_id": 15,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 67,
        "team_1_id": 38,
        "team_2_id": 35,
        "round": 1,
        "position": 3,
        "bracket_id": 15,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 68,
        "team_1_id": 39,
        "team_2_id": 34,
        "round": 1,
        "position": 4,
        "bracket_id": 15,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      
       {
        "game_id": 69,
        "team_1_id": 41,
        "team_2_id": 48,
        "round": 1,
        "position": 1,
        "bracket_id": 16,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 70,
        "team_1_id": 45,
        "team_2_id": 44,
        "round": 1,
        "position": 2,
        "bracket_id": 16,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id":71,
        "team_1_id": 46,
        "team_2_id": 43,
        "round": 1,
        "position": 3,
        "bracket_id": 16,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 72,
        "team_1_id": 47,
        "team_2_id": 42,
        "round": 1,
        "position": 4,
        "bracket_id": 16,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },




      {
        "game_id": 73,
        "round": 2,
        "position": 1,
        "bracket_id": 15,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      {
        "game_id": 74,
        "round": 2,
        "position": 2,
        "bracket_id": 15,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 75,
        "round": 2,
        "position": 1,
        "bracket_id": 16,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 76,
        "round": 2,
        "position": 2,
        "bracket_id": 16,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      
      
      
      
       {
        "game_id": 77,
        "round": 3,
        "position": 1,
        "bracket_id": 15,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 78,
        "round": 3,
        "position": 2,
        "bracket_id": 16,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id":79,
        "round": 4,
        "position": 1,
        "bracket_id": 17,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 80,
        "round": 4,
        "position": 2,
        "bracket_id": 17,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },






      {
        "game_id": 81,
        "round": 1,
        "position":1 ,
        "bracket_id": 18,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
            "game_id": 82,
            "round": 1,
            "position": 2,
            "bracket_id": 18,
            "game_start_time": "2021-05-02T10:00:00-05:00",
            "game_end_time": "2021-05-02T10:00:00-05:00",
            createdAt: new Date(),
            updatedAt: new Date(),
    },
    

 {
        "game_id": 83,
        "round": 1,
        "position":1 ,
        "bracket_id": 19,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
 },
 {
        "game_id": 84,
        "round": 1,
        "position": 2,
        "bracket_id": 19,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
 },


  
 {
        "game_id": 85,
         "round": 2,
        "position":1 ,
        "bracket_id": 18,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
 },
 
 {
        "game_id": 86,
        "round": 2,
        "position": 2,
        "bracket_id": 19,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
 },

 {
        "game_id": 87,
         "round": 3,
        "position":1 ,
        "bracket_id": 20,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
 },
 {
        "game_id": 88,
        "round": 3,
        "position": 2,
        "bracket_id": 20,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
 },


{
  "game_id": 89,
  "round": 1,
  "position":1 ,
  "bracket_id": 21,
  "game_start_time": "2021-05-02T10:00:00-05:00",
  "game_end_time": "2021-05-02T10:00:00-05:00",
  createdAt: new Date(),
  updatedAt: new Date(),
},

{
  "game_id": 90,
  "round": 1,
  "position": 2,
  "bracket_id": 21,
  "game_start_time": "2021-05-02T10:00:00-05:00",
  "game_end_time": "2021-05-02T10:00:00-05:00",
  createdAt: new Date(),
  updatedAt: new Date(),
},
{
  "game_id": 91,
   "round": 2,
  "position":1 ,
  "bracket_id": 21,
  "game_start_time": "2021-05-02T10:00:00-05:00",
  "game_end_time": "2021-05-02T10:00:00-05:00",
  createdAt: new Date(),
  updatedAt: new Date(),
},
{
  "game_id": 92,
  "round": 2,
  "position": 2,
  "bracket_id": 21,
  "game_start_time": "2021-05-02T10:00:00-05:00",
  "game_end_time": "2021-05-02T10:00:00-05:00",
  createdAt: new Date(),
  updatedAt: new Date(),
}, 


{
  "game_id": 93,
  "round": 1,
  "position":2 ,
  "bracket_id": 22,
  "game_start_time": "2021-05-02T10:00:00-05:00",
  "game_end_time": "2021-05-02T10:00:00-05:00",
  createdAt: new Date(),
  updatedAt: new Date(),
},

{
  "game_id": 94,
  "round": 1,
  "position": 2,
  "bracket_id": 22,
  "game_start_time": "2021-05-02T10:00:00-05:00",
  "game_end_time": "2021-05-02T10:00:00-05:00",
   createdAt: new Date(),
   updatedAt: new Date(),
},

{
   "game_id": 95,
   "round": 2,
   "position":1,
   "bracket_id": 22,
   "game_start_time": "2021-05-02T10:00:00-05:00",
   "game_end_time": "2021-05-02T10:00:00-05:00",
   createdAt: new Date(),
   updatedAt: new Date(),
},
{
  "game_id": 96,
  "round": 2,
  "position":2,
  "bracket_id": 22,
  "game_start_time": "2021-05-02T10:00:00-05:00",
  "game_end_time": "2021-05-02T10:00:00-05:00",
  createdAt: new Date(),
  updatedAt: new Date(),
}
    ])

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tournament_games', null, {});
  }
};
