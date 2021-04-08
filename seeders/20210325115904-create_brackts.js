'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tournament_breakets', [
      {
          "bracket_id": 1,
          "devision": "East",
          "round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
          "subseason_id":202101, 
          "bracket_position":"top_left", 
           createdAt: new Date(),
           updatedAt: new Date(),
         
      },
      {
          "bracket_id": 2,
          "devision": "West",
          "round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
          "subseason_id":202101, 
          "bracket_position":"top_right", 
           createdAt: new Date(),
           updatedAt: new Date(),
         
      },
      {
        "bracket_id": 3,
        "devision": "South",
        "round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
        "subseason_id":202101, 
        "bracket_position":"bottom_left", 
         createdAt: new Date(),
         updatedAt: new Date(),
       
    },
    {
        "bracket_id": 4,
        "devision": "Central",
        "round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
        "subseason_id":202101, 
        "bracket_position":"bottom_right", 
         createdAt: new Date(),
         updatedAt: new Date(),
       
    },
    {
      "bracket_id": 5,
      "devision": "National Champioship",
      "round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
      "subseason_id":202101, 
      "bracket_position":"center", 
       createdAt: new Date(),
       updatedAt: new Date(),     
    },
    {
      "bracket_id": 6,
      "devision": "",
      "round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
      "subseason_id":202102, 
      "bracket_position":"top_left", 
       createdAt: new Date(),
       updatedAt: new Date(),
     
   },
   {
      "bracket_id": 7,
      "devision": "",
      "round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
      "subseason_id":202102, 
      "bracket_position":"top_right", 
       createdAt: new Date(),
       updatedAt: new Date(),     
   },
   {
    "bracket_id": 8,
    "devision": "final",
    "round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
    "subseason_id":202102, 
    "bracket_position":"top_right", 
     createdAt: new Date(),
     updatedAt: new Date(),     
  },
  {
    "bracket_id": 9,
    "devision": "",
    "round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
    "subseason_id":202103, 
    "bracket_position":"top_left", 
     createdAt: new Date(),
     updatedAt: new Date(),
   
 },
 {
    "bracket_id": 10,
    "devision": "",
    "round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
    "subseason_id":202103, 
    "bracket_position":"top_right", 
     createdAt: new Date(),
     updatedAt: new Date(),     
 },
 {
  "bracket_id": 11,
  "devision": "final",
  "round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
  "subseason_id":202103, 
  "bracket_position":"center", 
   createdAt: new Date(),
   updatedAt: new Date(),     
},
{
  "bracket_id": 12,
  "devision": "",
  "round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
  "subseason_id":202104, 
  "bracket_position":"top_left", 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 13,
  "devision": "",
  "round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
  "subseason_id":202104, 
  "bracket_position":"top_right", 
   createdAt: new Date(),
   updatedAt: new Date(),     
},
{
  "bracket_id": 14,
  "devision": "final",
  "round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
  "subseason_id":202104, 
  "bracket_position":"center", 
  createdAt: new Date(),
  updatedAt: new Date(),     
},
{
  "bracket_id": 15,
  "devision": "East",
  "round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
  "subseason_id":202105, 
  "bracket_position":"top_left", 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
  "bracket_id": 16,
  "devision": "West",
  "round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
  "subseason_id":202105, 
  "bracket_position":"top_right", 
   createdAt: new Date(),
   updatedAt: new Date(),
 
},
{
"bracket_id": 17,
"devision": "South",
"round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
"subseason_id":202105, 
"bracket_position":"bottom_left", 
 createdAt: new Date(),
 updatedAt: new Date(),

},
{
"bracket_id": 18,
"devision": "",
"round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
"subseason_id":202106, 
"bracket_position":"top_left", 
createdAt: new Date(),
updatedAt: new Date(),

},
{
"bracket_id": 19,
"devision": "",
"round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
"subseason_id":202106, 
"bracket_position":"top_right", 
createdAt: new Date(),
updatedAt: new Date(),     
},
{
"bracket_id": 20,
"devision": "final",
"round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
"subseason_id":202106, 
"bracket_position":"center", 
createdAt: new Date(),
updatedAt: new Date(),     
},
{
"bracket_id": 21,
"devision": "",
"round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
"subseason_id":202107, 
"bracket_position":"top_left", 
createdAt: new Date(),
updatedAt: new Date(),

},
{
"bracket_id": 22,
"devision": "",
"round_labels": "{1:'1st ROUND', 2:'2nd ROUND', 3:'QUARTERFINAL', 4:'SEMIFINAL', 5:'CHAMPIONSHIP'}",
"subseason_id":202108, 
"bracket_position":"top_left", 
createdAt: new Date(),
updatedAt: new Date(),

}


  ]);
  
  
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tournament_breakets', null, {});
  }
};
