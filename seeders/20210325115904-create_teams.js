'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

  await queryInterface.bulkInsert('tournament_teams', 
  [
    {
        "team_id": 1,
        "name": "Army",
        "gender": "male",
            
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 2,
        "name": "NDC",
        "gender": "male",
            
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 3,
        "name": "Clemson",
        "gender": "male",
            
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 4,
        "name": "Wheeling",
        "gender": "male",
          
        
         createdAt: new Date(),
         updatedAt: new Date()
     },
     {
        "team_id": 5,
        "name": "Iowa",
        "gender": "male",
            
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
      {
        "team_id": 6,
        "name": "Christendom",
        "gender": "male",
            
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
        "team_id": 7,
        "name": "Tulane",
        "gender": "male",
            
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
        "team_id": 8,
        "name": "St. Scholastica",
        "gender": "male",
            
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 9,
        "name": "Life U",
        "gender": "male",
          
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 10,
        "name": "Dartmouth",
        "gender": "male",
        
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 11,
        "name": "Queens",
        "gender": "male",
        
        
         createdAt: new Date(),
         updatedAt: new Date(),
        },
     {
        "team_id": 12,
        "name": "Iowa State",
        "gender": "male",
        
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
        "team_id": 13,
        "name": "James Madison",
        "gender": "male",
        
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
      {
        "team_id": 14,
        "name": "Denver",
        "gender": "male",
        
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 15,
        "name": "New Mexico Tech",
        "gender": "male",
          
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
        "team_id": 16,
        "name": "Central College",
        "gender": "male",
            
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 17,
        "name": "Lindenwood",
        "gender": "male",
            
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 18,
        "name": "AIC",
        "gender": "male",
            
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 19,
        "name": "Virginia Tech",
        "gender": "male",
            
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 20,
        "name": "Spring Hill",
        "gender": "male",
          
        
         createdAt: new Date(),
         updatedAt: new Date()
     },
     {
        "team_id": 21,
        "name": "Marian",
        "gender": "male",
            
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
      {
        "team_id": 22,
        "name": "Loyola (MD)",
        "gender": "male",
            
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
        "team_id": 23,
        "name": "Franciscan",
        "gender": "male",
            
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
        "team_id": 24,
        "name": "Taylor",
        "gender": "male",
            
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 25,
        "name": "Davenport",
        "gender": "male",
          
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 26,
        "name": "Mount St Mary's",
        "gender": "male",
        
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 27,
        "name": "W Michigan",
        "gender": "male",
        
        
         createdAt: new Date(),
         updatedAt: new Date(),
        },
     {
        "team_id": 28,
        "name": "Furman",
        "gender": "male",
        
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
        "team_id": 29,
        "name": "McKendree",
        "gender": "male",
        
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
      {
        "team_id": 30,
        "name": "Nazareth",
        "gender": "male",
        
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 31,
        "name": "Salve Regina",
        "gender": "male",
          
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
      "team_id": 32,
      "name": "Lander",
      "gender": "male",
          
      
       createdAt: new Date(),
       updatedAt: new Date(),
   },
   {
    "team_id": 33,
    "name": "team33",
    "gender": "female",
        
    
     createdAt: new Date(),
     updatedAt: new Date(),
 },
 {
    "team_id": 34,
    "name": "team34",
    "gender": "female",
        
    
     createdAt: new Date(),
     updatedAt: new Date(),
 },
 {
    "team_id": 35,
    "name": "team35",
    "gender": "female",
        
    
     createdAt: new Date(),
     updatedAt: new Date(),
 },
 {
    "team_id": 36,
    "name": "team36",
    "gender": "female",
      
    
     createdAt: new Date(),
     updatedAt: new Date()
 },
 {
    "team_id": 37,
    "name": "team37",
    "gender": "female",
        
    
     createdAt: new Date(),
    updatedAt: new Date(),
 },
  {
    "team_id": 38,
    "name": "team38",
    "gender": "female",
        
    
     createdAt: new Date(),
    updatedAt: new Date(),
 },
 {
    "team_id": 39,
    "name": "team39",
    "gender": "female",
        
    
     createdAt: new Date(),
    updatedAt: new Date(),
 },
 {
    "team_id": 40,
    "name": "team40",
    "gender": "female",
        
    
     createdAt: new Date(),
     updatedAt: new Date(),
 },
 {
    "team_id": 41,
    "name": "team40",
    "gender": "female",
      
    
     createdAt: new Date(),
     updatedAt: new Date(),
 },
 {
    "team_id": 42,
    "name": "team42",
    "gender": "female",
    
    
     createdAt: new Date(),
     updatedAt: new Date(),
 },
 {
    "team_id": 43,
    "name": "team43",
    "gender": "female",
    
    
     createdAt: new Date(),
     updatedAt: new Date(),
    },
 {
    "team_id": 44,
    "name": "team44",
    "gender": "female",
    
    
     createdAt: new Date(),
    updatedAt: new Date(),
 },
 {
    "team_id": 45,
    "name": "team45",
    "gender": "female",
    
    
     createdAt: new Date(),
    updatedAt: new Date(),
 },
  {
    "team_id": 46,
    "name": "team46",
    "gender": "female",
    
    
     createdAt: new Date(),
     updatedAt: new Date(),
 },
 {
    "team_id": 47,
    "name": "team47",
    "gender": "female",
      
    
     createdAt: new Date(),
    updatedAt: new Date(),
 },
 {
    "team_id": 48,
    "name": "team48",
    "gender": "female",
        
    
     createdAt: new Date(),
     updatedAt: new Date(),
 }
   
   ]
);  
  

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tournament_teams', null, {});
  }
};
