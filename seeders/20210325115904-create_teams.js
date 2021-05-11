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
        "name": "Western Michigan",
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
        "name": "Loyola Maryland",
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
        "name": "BYE1",
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
        "name": "Iowa",
        "gender": "male",
            
        
         createdAt: new Date(),
         updatedAt: new Date(),
     },
     {
        "team_id": 12,
        "name": "Wheeling",
        "gender": "male",
          
        
         createdAt: new Date(),
         updatedAt: new Date()
     },
     
     {
        "team_id": 13,
        "name": "Lander",
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
        "name": "BYE3",
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
        "name": "BYE2",
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
      "name": "BYE4",
      "gender": "male",
          
      
       createdAt: new Date(),
       updatedAt: new Date(),
   },
   {
    "team_id": 33,
    "name": "Life Univ",
    "gender": "female",
        
    
     createdAt: new Date(),
     updatedAt: new Date(),
 },
 {
    "team_id": 34,
    "name": "Davenport Univ",
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
    "name": "Iowa State Univ",
    "gender": "female",
      
    
     createdAt: new Date(),
     updatedAt: new Date()
 },
 {
    "team_id": 37,
    "name": "BYE1",
    "gender": "female",
        
    
     createdAt: new Date(),
    updatedAt: new Date(),
 },
  {
    "team_id": 38,
    "name": "Baldwin",
    "gender": "female",
        
    
     createdAt: new Date(),
    updatedAt: new Date(),
 },
 {
    "team_id": 39,
    "name": "SARC Rep Side #2",
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
    "name": "Lindenwood Univ",
    "gender": "female",
      
    
     createdAt: new Date(),
     updatedAt: new Date(),
 },
 {
    "team_id": 42,
    "name": "Univ. Northern Iowa",
    "gender": "female",
    
    
     createdAt: new Date(),
     updatedAt: new Date(),
 },
 {
    "team_id": 43,
    "name": "Bryant Univ",
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
    "name": "BYE2",
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
    "name": "SARC Rep Side #1",
    "gender": "female",
      
    
     createdAt: new Date(),
    updatedAt: new Date(),
 },
 {
    "team_id": 48,
    "name": "Northern Lights Rep",
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
