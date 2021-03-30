'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      userName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.INTEGER,
        references: {
          model: 'roles', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
      },
      date_of_birth: {
        type: Sequelize.DATE,
     },

      phoneNumber: {
        type: Sequelize.STRING(50)
      },
      gender: {
        type: Sequelize.STRING(10)
      },
      countryCode: {
        type: Sequelize.STRING(10)
      },
      otp_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      OTP: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      email_verified: {
        type: Sequelize.TINYINT,
        defaultValue: 0
      },
      stateId:{
        type: Sequelize.TINYINT
      },
      countryId:{
        type: Sequelize.TINYINT
      },
      isSubscribed:{
        type: Sequelize.TINYINT
      },
      accepTermConditions:{
        type: Sequelize.TINYINT
      },
      reset_password_token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      reset_password_expires: {
        type: Sequelize.STRING,
        allowNull: true
      },
      verifyEmailToken:{
        type: Sequelize.STRING,
        allowNull: true
      },

      status: {
        type: Sequelize.TINYINT,
        defaultValue: 0
      },
      admin: {
        type: Sequelize.TINYINT,
        defaultValue: 0
      },
      isDeleted: {
        type: Sequelize.TINYINT,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    },{
    uniqueKeys: {
        Items_unique: {
            fields: ['userName', 'email']
        }
    }
});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
