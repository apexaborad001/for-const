'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

  await queryInterface.bulkInsert('tournament_teams', 
  [
    {
        "team_id": 1,
        "name": "Life",
        "gender": "male",
            
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 2,
        "name": "W. Michigan",
        "gender": "male",
            
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 3,
        "name": "Iowa State",
        "gender": "male",
            
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 4,
        "name": "Salve Regina",
        "gender": "male",
          
        
         createdAt: new Date(),
         updatedAt: new Date()
     },
     {
        "team_id": 5,
        "name": "Loyola (MD)",
        "gender": "male",
            
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
      {
        "team_id": 6,
        "name": "Franciscan",
        "gender": "male",
            
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
        "team_id": 7,
        "name": "Wayne State",
        "gender": "male",
            
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
        "team_id": 8,
        "name": "BYE #1",
        "gender": "male",
            
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     
     {
        "team_id": 9,
        "name": "Army",
        "gender": "male",
            
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 10,
        "name": "Air Force",
        "gender": "male",
            
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 11,
        "name": "Wheeling",
        "gender": "male",
            
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 12,
        "name": "Lander",
        "gender": "male",
          
        
         createdAt: new Date(),
         updatedAt: new Date()
     },
     
     {
        "team_id": 13,
        "name": "Louisiana",
        "gender": "male",
            
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
      {
        "team_id": 14,
        "name": "New Mexico Tech",
        "gender": "male",
            
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
        "team_id": 15,
        "name": "Central College",
        "gender": "male",
            
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
        "team_id": 16,
        "name": "BYE #3",
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
        "name": "NDC",
        "gender": "male",
        
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 19,
        "name": "AIC",
        "gender": "male",
        
        
         createdAt: new Date(),
         updatedAt: new Date(),
        },
     {
        "team_id": 20,
        "name": "McKendree",
        "gender": "male",
        
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
        "team_id": 21,
        "name": "Denver",
        "gender": "male",
        
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
      {
        "team_id": 22,
        "name": "Tulane",
        "gender": "male",
        
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 23,
        "name": "Taylor",
        "gender": "male",
          
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
        "team_id": 24,
        "name": "BYE #2",
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
        "name": "Mount St. Mary's",
        "gender": "male",
        
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 27,
        "name": "James Madison",
        "gender": "male",
        
        
         createdAt: new Date(),
         updatedAt: new Date(),
        },
     {
        "team_id": 28,
        "name": "Christendom",
        "gender": "male",
        
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
        "team_id": 29,
        "name": "Marian",
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
        "name": "St. Scholastica",
        "gender": "male",
          
        
         createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
      "team_id": 32,
      "name": "BYE #4",
      "gender": "male",
          
      
       createdAt: new Date(),
       updatedAt: new Date(),
   },
   {
    "team_id": 33,
    "name": "Life",
    "gender": "female",
        
    
     createdAt: new Date(),
     updatedAt: new Date(),
 },
 {
    "team_id": 34,
    "name": "Davenport",
    "gender": "female",
        
    
     createdAt: new Date(),
     updatedAt: new Date(),
 },
 {
    "team_id": 35,
    "name": "Wayne State",
    "gender": "female",
        
    
     createdAt: new Date(),
     updatedAt: new Date(),
 },
 {
    "team_id": 36,
    "name": "Iowa State",
    "gender": "female",
      
    
     createdAt: new Date(),
     updatedAt: new Date()
 },
 {
    "team_id": 37,
    "name": "BYE #1",
    "gender": "female",
        
    
     createdAt: new Date(),
    updatedAt: new Date(),
 },
  {
    "team_id": 38,
    "name": "Baldwin Wallace",
    "gender": "female",
        
    
     createdAt: new Date(),
    updatedAt: new Date(),
 },
 {
    "team_id": 39,
    "name": "SARC Rep #2",
    "gender": "female",
        
    
     createdAt: new Date(),
    updatedAt: new Date(),
 },
 {
    "team_id": 40,
    "name": "Allegheny Rep",
    "gender": "female",
        
    
     createdAt: new Date(),
     updatedAt: new Date(),
 },
 {
    "team_id": 41,
    "name": "Lindenwood",
    "gender": "female",
      
    
     createdAt: new Date(),
     updatedAt: new Date(),
 },
 {
    "team_id": 42,
    "name": "UNI",
    "gender": "female",
    
    
     createdAt: new Date(),
     updatedAt: new Date(),
 },
 {
    "team_id": 43,
    "name": "Bryant",
    "gender": "female",
    
    
     createdAt: new Date(),
     updatedAt: new Date(),
    },
 {
    "team_id": 44,
    "name": "Iowa Univ",
    "gender": "female",
    
    
     createdAt: new Date(),
    updatedAt: new Date(),
 },
 {
    "team_id": 45,
    "name": "BYE #2",
    "gender": "female",
    
    
     createdAt: new Date(),
    updatedAt: new Date(),
 },
  {
    "team_id": 46,
    "name": "Grace College",
    "gender": "female",
    
    
     createdAt: new Date(),
     updatedAt: new Date(),
 },
 {
    "team_id": 47,
    "name": "SARC Rep #1",
    "gender": "female",
      
    
     createdAt: new Date(),
    updatedAt: new Date(),
 },
 {
    "team_id": 48,
    "name": "Northern Lights",
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
