'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('apiErrorLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      apiName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      apiUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userType: {
        type: Sequelize.ENUM,
        values: ['guest', 'user'],
        defaultValue: 'guest'
      },
      deviceType: {
        type: Sequelize.STRING
      },
      device: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      requestBody: {
        type: Sequelize.TEXT
      },
      responseBody: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('apiErrorLogs');
  }
};