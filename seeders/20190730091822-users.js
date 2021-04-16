'use strict';

const bcrypt = require('bcrypt-nodejs');
let hashPassword = async (password) => {
  return await bcrypt.hashSync(password);
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkInsert('users', [{
      firstName:"Admin",
      lastName:"Admin",
      userName:"superadmin",
      email: 'superadmin@mobikasa.com',
      password: await hashPassword('Qwerty@123'),
      email_verified:1,
      role: 3,
      admin:1,
      status:1,
      createdAt: new Date(),
      updatedAt: new Date()      
    },
    {
      firstName:"Admin",
      lastName:"Admin",
      userName:"testadmin",
      email: 'testadmin@mobikasa.com',
      password: await hashPassword('Qwerty@123'),
      email_verified:1,
      role: 3,
      admin:1,
      status:1,
      createdAt: new Date(),
      updatedAt: new Date()      
    }         
  ]);   
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
    //return queryInterface.bulkDelete('users', null, {});   
  }
};
