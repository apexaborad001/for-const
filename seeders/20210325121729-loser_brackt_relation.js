'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.bulkInsert('loser_brackt_relation', [
      {
          "bracket_id": 1,
          "round": 1,
          "nextbracketid": 6,
          "nextround":1, 
          "point":0, 
           createdAt: new Date(),
           updatedAt: new Date(),
         
      },
      {
        "bracket_id": 3,
        "round": 1,
        "nextbracketid": 6,
        "nextround":1, 
        "point":0, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
      },
      {
        "bracket_id": 2,
        "round": 1,
        "nextbracketid": 7,
        "nextround":1, 
        "point":0, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
      },
      {
        "bracket_id": 4,
        "round": 1,
        "nextbracketid": 7,
        "nextround":1, 
        "point":0, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
      },
      {
        "bracket_id": 1,
        "round": 2,
        "nextbracketid": 12,
        "nextround":1, 
        "point":0, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
     },
     {
      "bracket_id": 3,
      "round": 2,
      "nextbracketid": 12,
      "nextround":1, 
      "point":0, 
       createdAt: new Date(),
       updatedAt: new Date(),
     
     },
    {
      "bracket_id": 2,
      "round": 2,
      "nextbracketid": 13,
      "nextround":1, 
      "point":0, 
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 4,
      "round": 2,
      "nextbracketid": 13,
      "nextround":1, 
      "point":0, 
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 5,
      "round": 4,
      "nextbracketid": 5,
      "nextround":5, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 8,
      "round": 3,
      "nextbracketid": 8,
      "nextround":4, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 11,
      "round": 2,
      "nextbracketid": 11,
      "nextround":3, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },    
    {
      "bracket_id": 12,
      "round": 2,
      "nextbracketid": 14,
      "nextround":3, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 13,
      "round": 2,
      "nextbracketid": 14,
      "nextround":3, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
        "bracket_id": 6,
        "round": 1,
        "nextbracketid": 9,
        "nextround":1, 
        "point":0, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
    },
    {
      "bracket_id": 7,
      "round": 1,
      "nextbracketid": 10,
      "nextround":1, 
      "point":0, 
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
          "bracket_id": 15,
          "round": 1,
          "nextbracketid": 18,
          "nextround":1, 
          "point":0, 
           createdAt: new Date(),
           updatedAt: new Date(),
         
      },
      {
        "bracket_id": 16,
        "round": 1,
        "nextbracketid": 19,
        "nextround":1, 
        "point":0, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
      },
       {
        "bracket_id": 15,
        "round": 2,
        "nextbracketid": 22,
        "nextround":1, 
        "point":0, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
     },
     {
      "bracket_id": 16,
      "round": 2,
      "nextbracketid": 22,
      "nextround":1, 
      "point":0, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
     },
    {
      "bracket_id": 18,
      "round": 2,
      "nextbracketid": 22,
      "nextround":1, 
      "point":0, 
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
      {
        "bracket_id": 19,
        "round": 2,
        "nextbracketid": 22,
        "nextround":1, 
        "point":0, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
    },
    {
      "bracket_id": 15,
      "round": 3,
      "nextbracketid": 17,
      "nextround":4, 
      "point":0, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 16,
      "round": 3,
      "nextbracketid": 17,
      "nextround":4, 
      "point":0, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 20,
      "round": 2,
      "nextbracketid": 20,
      "nextround":3, 
      "point":0, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    
    {
      "bracket_id": 19,
      "round": 1,
      "nextbracketid": 21,
      "nextround":1, 
      "point":0, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 18,
      "round": 1,
      "nextbracketid": 21,
      "nextround":1, 
      "point":0, 
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 21,
      "round": 1,
      "nextbracketid": 21,
      "nextround":2, 
      "point":0, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },

    {
      "bracket_id": 22,
      "round": 1,
      "nextbracketid": 22,
      "nextround":2, 
      "point":0, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
    },
    {
      "bracket_id": 14,
      "round": 2,
      "nextbracketid": 14,
      "nextround":3, 
      "point":0, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
    }
  ]);
  
  
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('loser_brackt_relation', null, {});
  }
};