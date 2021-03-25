'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tournament_teams', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      team_id: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      thumbnails: {
        type: Sequelize.STRING
      },
      current_subseason_ids: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING(10)
      },
      league_id: {
        type: Sequelize.INTEGER
      },
      current_score: {
        type: Sequelize.INTEGER
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
            fields: ['team_id']
        }
    }
});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tournament_teams');
  }
};