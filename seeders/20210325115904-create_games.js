'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tournament_games', [
      {
        "game_id": 1,
        "team_1_id": 1,
        "team_2_id": 8,
        "round": 1,
        "position": 1,
        "bracket_id": 1,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 2,
        "team_1_id": 5,
        "team_2_id": 4,
        "round": 1,
        "position": 2,
        "bracket_id": 1,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 3,
        "team_1_id": 6,
        "team_2_id": 3,
        "round": 1,
        "position": 3,
        "bracket_id": 1,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 4,
        "team_1_id": 7,
        "team_2_id": 2,
        "round": 1,
        "position": 4,
        "bracket_id": 1,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      
       {
        "game_id": 5,
        "team_1_id": 9,
        "team_2_id": 16,
        "round": 1,
        "position": 5,
        "bracket_id": 3,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 6,
        "team_1_id": 13,
        "team_2_id": 12,
        "round": 1,
        "position": 6,
        "bracket_id": 3,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id":7,
        "team_1_id": 14,
        "team_2_id": 11,
        "round": 1,
        "position": 7,
        "bracket_id": 3,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 8,
        "team_1_id": 15,
        "team_2_id": 10,
        "round": 1,
        "position": 8,
        "bracket_id": 3,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },




      {
        "game_id": 9,
        "team_1_id": 17,
        "team_2_id": 24,
        "round": 1,
        "position": 1,
        "bracket_id": 2,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      {
        "game_id": 10,
        "team_1_id": 21,
        "team_2_id": 20,
        "round": 1,
        "position": 2,
        "bracket_id": 2,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 11,
        "team_1_id": 22,
        "team_2_id": 19,
        "round": 1,
        "position": 3,
        "bracket_id": 2,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 12,
        "team_1_id": 23,
        "team_2_id": 18,
        "round": 1,
        "position": 4,
        "bracket_id": 2,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      
      
      
      
       {
        "game_id": 13,
        "team_1_id": 25,
        "team_2_id": 32,
        "round": 1,
        "position": 5,
        "bracket_id": 4,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 14,
        "team_1_id": 29,
        "team_2_id": 28,
        "round": 1,
        "position": 6,
        "bracket_id": 4,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id":15,
        "team_1_id": 30,
        "team_2_id": 27,
        "round": 1,
        "position": 7,
        "bracket_id": 4,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 16,
        "team_1_id": 31,
        "team_2_id": 26,
        "round": 1,
        "position": 8,
        "bracket_id": 4,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },






      {
        "game_id": 17,
        "round": 2,
        "position":1 ,
        "bracket_id": 1,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
            "game_id": 18,
            "round": 2,
            "position": 2,
            "bracket_id": 1,
            "game_start_time": "2021-05-02T10:00:00-05:00",
            "game_end_time": "2021-05-02T10:00:00-05:00",
            createdAt: new Date(),
            updatedAt: new Date(),
    },
    

 {
        "game_id": 19,
        "round": 2,
        "position":3 ,
        "bracket_id": 3,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
 },
 {
        "game_id": 20,
        "round": 2,
        "position": 4,
        "bracket_id": 3,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
 },


  
 {
        "game_id": 21,
         "round": 2,
        "position":1 ,
        "bracket_id": 2,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
 },
 
 {
        "game_id": 22,
        "round": 2,
        "position": 2,
        "bracket_id": 2,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
 },

 {
        "game_id": 23,
         "round": 2,
        "position":3 ,
        "bracket_id": 4,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
 },
 {
        "game_id": 24,
        "round": 2,
        "position": 4,
        "bracket_id": 4,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
 },


{
  "game_id": 25,
   "round": 3,
  "position":1 ,
  "bracket_id": 1,
  "game_start_time": "2021-05-02T10:00:00-05:00",
  "game_end_time": "2021-05-02T10:00:00-05:00",
  createdAt: new Date(),
  updatedAt: new Date(),
},

{
  "game_id": 26,
  "round": 3,
  "position": 2,
  "bracket_id": 3,
  "game_start_time": "2021-05-02T10:00:00-05:00",
  "game_end_time": "2021-05-02T10:00:00-05:00",
  createdAt: new Date(),
  updatedAt: new Date(),
},
{
  "game_id": 27,
   "round": 3,
  "position":1 ,
  "bracket_id": 2,
  "game_start_time": "2021-05-02T10:00:00-05:00",
  "game_end_time": "2021-05-02T10:00:00-05:00",
  createdAt: new Date(),
  updatedAt: new Date(),
},
{
  "game_id": 28,
  "round": 3,
  "position": 2,
  "bracket_id": 4,
  "game_start_time": "2021-05-02T10:00:00-05:00",
  "game_end_time": "2021-05-02T10:00:00-05:00",
  createdAt: new Date(),
  updatedAt: new Date(),
}, 


{
  "game_id": 29,
  "round": 4,
  "position":1 ,
  "bracket_id": 5,
  "game_start_time": "2021-05-02T10:00:00-05:00",
  "game_end_time": "2021-05-02T10:00:00-05:00",
  createdAt: new Date(),
  updatedAt: new Date(),
},

{
  "game_id": 30,
  "round": 4,
  "position": 2,
  "bracket_id": 5,
  "game_start_time": "2021-05-02T10:00:00-05:00",
  "game_end_time": "2021-05-02T10:00:00-05:00",
   createdAt: new Date(),
   updatedAt: new Date(),
},

{
   "game_id": 31,
   "round": 5,
   "position":1 ,
   "bracket_id": 5,
   "game_start_time": "2021-05-02T10:00:00-05:00",
   "game_end_time": "2021-05-02T10:00:00-05:00",
   createdAt: new Date(),
   updatedAt: new Date(),
},
{
  "game_id": 32,
  "round": 5,
  "position":2,
  "bracket_id": 5,
  "game_start_time": "2021-05-02T10:00:00-05:00",
  "game_end_time": "2021-05-02T10:00:00-05:00",
  createdAt: new Date(),
  updatedAt: new Date(),
},

       {
        "game_id": 33,
        "round": 1,
        "position": 1,
        "bracket_id": 6,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 34,
        "round": 1,
        "position": 2,
        "bracket_id": 6,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 35,
        "round": 1,
        "position": 3,
        "bracket_id": 6,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 36,
        "round": 1,
        "position": 4,
        "bracket_id": 6,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      



      {
        "game_id": 37,
        "round": 1,
        "position": 1,
        "bracket_id": 7,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 38,
        "round": 1,
        "position": 2,
        "bracket_id": 7,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 39,
        "round": 1,
        "position": 3,
        "bracket_id": 7,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 40,
        "round": 1,
        "position": 4,
        "bracket_id": 7,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 41,
        "round": 2,
        "position": 1,
        "bracket_id": 6,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 42,
        "round": 2,
        "position": 2,
        "bracket_id": 6,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 43,
        "round": 2,
        "position": 1,
        "bracket_id": 7,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 44,
        "round": 2,
        "position": 2,
        "bracket_id": 7,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 45,
        "round": 3,
        "position": 1,
        "bracket_id": 8,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 46,
        "round": 3,
        "position": 2,
        "bracket_id": 8,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 47,
        "round": 4,
        "position": 1,
        "bracket_id": 8,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 48,
        "round": 4,
        "position": 2,
        "bracket_id": 8,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        "game_id": 49,
        "round": 1,
        "position": 1,
        "bracket_id": 9,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 50,
        "round": 1,
        "position": 2,
        "bracket_id": 9,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
     
      {
        "game_id": 51,
        "round": 1,
        "position": 1,
        "bracket_id": 10,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 52,
        "round": 1,
        "position": 2,
        "bracket_id": 10,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 53,
        "round": 2,
        "position": 1,
        "bracket_id": 11,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 54,
        "round": 2,
        "position": 2,
        "bracket_id": 11,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 55,
        "round": 3,
        "position": 1,
        "bracket_id": 11,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
        "game_id": 56,
        "round": 3,
        "position": 2,
        "bracket_id": 11,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      
      {
        "game_id": 57,
        "round": 1,
        "position": 1,
        "bracket_id": 12,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 58,
        "round": 1,
        "position": 2,
        "bracket_id": 12,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
     
      {
        "game_id": 59,
        "round": 1,
        "position": 1,
        "bracket_id": 13,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 60,
        "round": 1,
        "position": 2,
        "bracket_id": 13,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 61,
        "round": 2,
        "position": 1,
        "bracket_id": 14,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 62,
        "round": 2,
        "position": 2,
        "bracket_id": 14,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        "game_id": 63,
        "round": 3,
        "position": 1,
        "bracket_id": 14,
        "game_start_time": "2021-05-02T10:00:00-05:00",
        "game_end_time": "2021-05-02T10:00:00-05:00",
         createdAt: new Date(),
         updatedAt: new Date(),
      },      
      {
        "game_id": 64,
        "round": 3,
        "position": 2,
        "bracket_id": 14,
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
