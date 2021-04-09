'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('winner_brackt_relation', [
      {
          "bracket_id": 1,
          "round": 1,
          "nextbracketid": 1,
          "nextround":2, 
          "point":15, 
           createdAt: new Date(),
           updatedAt: new Date(),
         
      },
      {
        "bracket_id": 1,
        "round": 2,
        "nextbracketid": 1,
        "nextround":3, 
        "point":30, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
      },
      {
        "bracket_id": 1,
        "round": 3,
        "nextbracketid": 5,
        "nextround":4, 
        "point":60, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
      },
      {
        "bracket_id": 2,
        "round": 1,
        "nextbracketid": 2,
        "nextround":2, 
        "point":15, 
         createdAt: new Date(),
         updatedAt: new Date(),
       
     },
    {
      "bracket_id": 2,
      "round": 2,
      "nextbracketid": 2,
      "nextround":3, 
      "point":30, 
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 2,
      "round": 3,
      "nextbracketid": 5,
      "nextround":4, 
      "point":60, 
      "position_relation":"1:2",
       createdAt: new Date(),
       updatedAt: new Date(),
     
    },
    {
      "bracket_id": 3,
      "round": 1,
      "nextbracketid": 3,
      "nextround":2, 
      "point":15, 
       createdAt: new Date(),
       updatedAt: new Date(),
     
  },
  {
    "bracket_id": 3,
    "round": 2,
    "nextbracketid": 3,
    "nextround":3, 
    "point":30, 
     createdAt: new Date(),
     updatedAt: new Date(),
   
  },
  {
    "bracket_id": 3,
    "round": 3,
    "nextbracketid": 5,
    "nextround":4, 
    "point":60, 
     createdAt: new Date(),
     updatedAt: new Date(),
   
  },
  {
    "bracket_id": 4,
    "round": 1,
    "nextbracketid": 4,
    "nextround":2, 
    "point":15, 
     createdAt: new Date(),
     updatedAt: new Date(),
   
},
{
  "bracket_id": 4,
  "round": 2,
  "nextbracketid": 4,
  "nextround":3, 
  "point":30, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 4,
  "round": 3,
  "nextbracketid": 5,
  "nextround":4, 
  "point":60, 
  "position_relation":"2:2",
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 5,
  "round": 4,
  "nextbracketid": 5,
  "nextround":5, 
  "point":120, 
   createdAt: new Date(),
   updatedAt: new Date(),
 },
 {
  "bracket_id": 5,
  "round": 5,
  "point":240, 
  "position_relation":"1:1:240,2:1:120",
   createdAt: new Date(),
   updatedAt: new Date(),
 },


{
  "bracket_id": 6,
  "round": 1,
  "nextbracketid": 6,
  "nextround":2, 
  "point":30, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 6,
  "round": 2,
  "nextbracketid": 8,
  "nextround":3, 
  "point":60, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},

{
  "bracket_id": 7,
  "round": 1,
  "nextbracketid": 7,
  "nextround":2, 
  "point":30, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 7,
  "round": 2,
  "nextbracketid": 8,
  "nextround":3, 
  "point":60,
  "position_relation":"1:2", 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 8,
  "round": 3,
  "nextbracketid": 8,
  "nextround":4, 
  "point":120, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},{
  "bracket_id": 8,
  "round": 4, 
  "point":240, 
  "position_relation":"1:1:240,2:1:120",
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 9,
  "round": 1,
  "nextbracketid": 11,
  "nextround":2, 
  "point":60, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},

{
  "bracket_id": 10,
  "round": 1,
  "nextbracketid": 11,
  "nextround":2, 
  "point":60, 
  "position_relation":"1:2,2:2",
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 11,
  "round": 2,
  "nextbracketid": 11,
  "nextround":3, 
  "point":120, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},{
  "bracket_id": 11,
  "round": 3,
  "point":240, 
  "position_relation":"1:1:240,2:1:120",
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 12,
  "round": 1,
  "nextbracketid": 14,
  "nextround":2, 
  "point":60, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 13,
  "round": 1,
  "nextbracketid": 14,
  "nextround":2, 
  "point":60, 
  "position_relation":"1:2,2:2",
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 14,
  "round": 2,
  "nextbracketid": 14,
  "nextround":3, 
  "point":120, 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 14,
  "round": 3,
  "point":240,
  "position_relation":"1:1:240,2:1:120", 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
  ]);
  
  
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('winner_brackt_relation', null, {});
  }
};
