'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notificationSubscriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Refers to table name
          key: 'id', // Refers to column name in table
        },
        onDelete: "cascade",
        onUpdate: "cascade",
        allowNull: true
      },
      token: {
        type: Sequelize.STRING,
      },
      endpoint: {
        type: Sequelize.TEXT,
      },
      auth_key: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notificationSubscriptions');
  }
};
