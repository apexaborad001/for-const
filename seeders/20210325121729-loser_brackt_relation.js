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
     
    }
  ]);
  
  
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('loser_brackt_relation', null, {});
  }
};