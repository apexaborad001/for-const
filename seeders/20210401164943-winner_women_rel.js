'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('winner_brackt_relation', [
      {
          "bracket_id": 15,
          "round": 1,
          "nextbracketid": 15,
          "nextround":2, 
          "point":30, 
           createdAt: new Date(),
           updatedAt: new Date(),
         
      },
      {
        "bracket_id": 15,
        "round": 2,
        "nextbracketid": 15,
        "nextround":3, 
        "point":60, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
      },
      {
        "bracket_id": 16,
        "round": 1,
        "nextbracketid": 16,
        "nextround":2, 
        "point":30, 
        "position_relation":"1:2,2:2", 
         createdAt: new Date(),
         updatedAt: new Date(),
       
      },
      {
        "bracket_id": 16,
        "round": 2,
        "nextbracketid": 16,
        "nextround":3, 
        "point":60,
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
      "bracket_id": 16,
      "round": 3,
      "nextbracketid": 14,
      "nextround":3, 
      "point":60,
       createdAt: new Date(),
       updatedAt: new Date(),
   },
     {
      "bracket_id": 15,
      "round": 3,
      "nextbracketid": 17,
      "nextround":4, 
      "point":60, 
       createdAt: new Date(),
       updatedAt: new Date() 
    },
    {
      "bracket_id": 17,
      "round": 4,
      "point":240, 
      "position_relation":"1:1:240, 2:1:120", 
       createdAt: new Date(),
       updatedAt: new Date() 
    },
  {
    "bracket_id": 1,
    "round": 4,
    "point":240, 
    "position_relation":"1:1:240, 2:1:120",
     createdAt: new Date(),
     updatedAt: new Date(),
   
   },
    {
      "bracket_id": 18,
      "round": 1,
      "nextbracketid": 20,
      "nextround":2, 
      "point":60, 
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 19,
      "round": 1,
      "nextbracketid": 20,
      "nextround":2, 
      "point":60, 
      "position_relation":"1:2,2:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
  },
  {
    "bracket_id": 20,
    "round": 2,
    "nextbracketid": 20,
    "nextround":3, 
    "point":60, 
     createdAt: new Date(),
     updatedAt: new Date(),
   
  },
  {
    "bracket_id": 20,
    "round": 3,
    "point":240, 
    "position_relation":"1:1:240, 2:1:120",
     createdAt: new Date(),
     updatedAt: new Date(),
  },
  {
    "bracket_id": 21,
    "round": 1,
    "nextbracketid": 21,
    "nextround":2, 
    "point":120, 
     createdAt: new Date(),
     updatedAt: new Date(),
},
{
  "bracket_id": 21,
  "round": 2,
  "point":240, 
  "position_relation":"1:1:240, 2:1:120",
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 22,
  "round": 1,
  "nextbracketid": 22,
  "nextround":2, 
  "point":120, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
"bracket_id": 22,
"round": 2,
"point":240, 
"position_relation":"1:1:240, 2:1:120",
 createdAt: new Date(),
 updatedAt: new Date(),
}  ]);
  
  
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('winner_brackt_relation', null, {});
  }
};
