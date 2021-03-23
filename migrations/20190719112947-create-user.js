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
      fullName: {
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
            fields: ['userName']
        }
    }
});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
