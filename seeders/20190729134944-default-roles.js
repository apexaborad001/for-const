'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles', [
      { id : 1, role: 'Collegiate Player'},
      { id : 2, role: 'High School Player'},
      { id : 3, role: 'Coach/Administrator'},
      { id : 4, role: 'Fan'},
      { id : 5, role: 'Other'}
    ], {}); 
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {});
  }
};
