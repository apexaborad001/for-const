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
      "bracket_id": 6,
      "round": 3,
      "nextbracketid": 8,
      "nextround":4, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 7,
      "round": 3,
      "nextbracketid": 8,
      "nextround":4, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 9,
      "round": 2,
      "nextbracketid": 11,
      "nextround":3, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 10,
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
          "nextbracketid": 20,
          "nextround":1, 
          "point":0, 
           createdAt: new Date(),
           updatedAt: new Date(),
         
      },
      {
        "bracket_id": 17,
        "round": 1,
        "nextbracketid": 20,
        "nextround":1, 
        "point":0, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
      },
      {
        "bracket_id": 16,
        "round": 1,
        "nextbracketid": 21,
        "nextround":1, 
        "point":0, 
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
        "bracket_id": 15,
        "round": 2,
        "nextbracketid": 26,
        "nextround":1, 
        "point":0, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
     },
     {
      "bracket_id": 17,
      "round": 2,
      "nextbracketid": 26,
      "nextround":1, 
      "point":0, 
       createdAt: new Date(),
       updatedAt: new Date(),
     
     },
    {
      "bracket_id": 16,
      "round": 2,
      "nextbracketid": 27,
      "nextround":1, 
      "point":0, 
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 18,
      "round": 2,
      "nextbracketid": 27,
      "nextround":1, 
      "point":0, 
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
      {
        "bracket_id": 20,
        "round": 1,
        "nextbracketid": 23,
        "nextround":1, 
        "point":0, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
    },
    {
      "bracket_id": 21,
      "round": 1,
      "nextbracketid": 24,
      "nextround":1, 
      "point":0, 
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    

    {
      "bracket_id": 19,
      "round": 4,
      "nextbracketid": 19,
      "nextround":5, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 20,
      "round": 3,
      "nextbracketid": 22,
      "nextround":4, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 21,
      "round": 3,
      "nextbracketid": 22,
      "nextround":4, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 23,
      "round": 2,
      "nextbracketid": 25,
      "nextround":3, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 24,
      "round": 2,
      "nextbracketid": 25,
      "nextround":3, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    
    {
      "bracket_id": 26,
      "round": 2,
      "nextbracketid": 28,
      "nextround":3, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 27,
      "round": 2,
      "nextbracketid": 28,
      "nextround":3, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },




  ]);
  
  
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('loser_brackt_relation', null, {});
  }
};