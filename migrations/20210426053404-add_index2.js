'use strict';
module.exports = {
  up: async(queryInterface, Sequelize) => {
       await queryInterface.addIndex('user_breakets', ['user_id']);
  },
  down: async(queryInterface, Sequelize) => {
   
  }
};
