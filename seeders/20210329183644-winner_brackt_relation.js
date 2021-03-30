'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('winner_brackt_relation', [
      {
          "bracket_id": 1,
          "round": 1,
          "nextbracketid": 1,
          "nextround":2, 
          "point":20, 
           createdAt: new Date(),
           updatedAt: new Date(),
         
      },
      {
        "bracket_id": 1,
        "round": 2,
        "nextbracketid": 1,
        "nextround":3, 
        "point":20, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
      },
      {
        "bracket_id": 1,
        "round": 3,
        "nextbracketid": 1,
        "nextround":4, 
        "point":20, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
      },
      {
        "bracket_id": 1,
        "round": 4,
        "nextbracketid": 5,
        "nextround":5, 
        "point":20, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
      },
      {
        "bracket_id": 2,
        "round": 1,
        "nextbracketid": 2,
        "nextround":2, 
        "point":20, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
    },
    {
      "bracket_id": 2,
      "round": 2,
      "nextbracketid": 2,
      "nextround":3, 
      "point":20, 
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 2,
      "round": 3,
      "nextbracketid": 2,
      "nextround":4, 
      "point":20, 
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 2,
      "round": 4,
      "nextbracketid": 5,
      "nextround":5, 
      "point":20, 
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 3,
      "round": 1,
      "nextbracketid": 3,
      "nextround":2, 
      "point":20, 
       createdAt: new Date(),
       updatedAt: new Date(),
     
  },
  {
    "bracket_id": 3,
    "round": 2,
    "nextbracketid": 3,
    "nextround":3, 
    "point":20, 
     createdAt: new Date(),
     updatedAt: new Date(),
   
  },
  {
    "bracket_id": 3,
    "round": 3,
    "nextbracketid": 3,
    "nextround":4, 
    "point":20, 
     createdAt: new Date(),
     updatedAt: new Date(),
   
  },
  {
    "bracket_id": 3,
    "round": 4,
    "nextbracketid": 5,
    "nextround":5, 
    "point":20, 
     createdAt: new Date(),
     updatedAt: new Date(),
   
  },
  {
    "bracket_id": 4,
    "round": 1,
    "nextbracketid": 4,
    "nextround":2, 
    "point":20, 
     createdAt: new Date(),
     updatedAt: new Date(),
   
},
{
  "bracket_id": 4,
  "round": 2,
  "nextbracketid": 4,
  "nextround":3, 
  "point":20, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 4,
  "round": 3,
  "nextbracketid": 4,
  "nextround":4, 
  "point":20, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 4,
  "round": 4,
  "nextbracketid": 5,
  "nextround":5, 
  "point":20, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 5,
  "round": 5,
  "point":20, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 6,
  "round": 1,
  "nextbracketid": 6,
  "nextround":2, 
  "point":10, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 6,
  "round": 2,
  "nextbracketid": 6,
  "nextround":3, 
  "point":10, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 6,
  "round": 3,
  "nextbracketid": 6,
  "nextround":4, 
  "point":20, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 6,
  "round": 4,
  "nextbracketid": 8,
  "nextround":5, 
  "point":10, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 7,
  "round": 1,
  "nextbracketid": 7,
  "nextround":2, 
  "point":10, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 7,
  "round": 2,
  "nextbracketid": 7,
  "nextround":3, 
  "point":10, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 7,
  "round": 3,
  "nextbracketid": 7,
  "nextround":4, 
  "point":20, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 7,
  "round": 4,
  "nextbracketid": 8,
  "nextround":5, 
  "point":10, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 9,
  "round": 1,
  "nextbracketid": 9,
  "nextround":2, 
  "point":10, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 9,
  "round": 2,
  "nextbracketid": 9,
  "nextround":3, 
  "point":10, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 9,
  "round": 3,
  "nextbracketid": 9,
  "nextround":4, 
  "point":20, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 9,
  "round": 4,
  "nextbracketid": 11,
  "nextround":5, 
  "point":10, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 10,
  "round": 1,
  "nextbracketid": 10,
  "nextround":2, 
  "point":10, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 10,
  "round": 2,
  "nextbracketid": 10,
  "nextround":3, 
  "point":10, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 10,
  "round": 3,
  "nextbracketid": 10,
  "nextround":4, 
  "point":20, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 10,
  "round": 4,
  "nextbracketid": 11,
  "nextround":5, 
  "point":10, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
}

  ]);
  
  
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('winner_brackt_relation', null, {});
  }
};
