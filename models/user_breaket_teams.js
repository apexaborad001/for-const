'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = (sequelize, DataTypes) => {

  const userBreaketTeams = sequelize.define('user_breaket_team', {
    user_bracket_id:DataTypes.INTEGER,
    game_id: DataTypes.INTEGER,
    team_1_id:DataTypes.INTEGER,
    team_2_id:DataTypes.INTEGER,
    winner_id:DataTypes.INTEGER,
    team_1_score: DataTypes.INTEGER,
    team_2_score:DataTypes.INTEGER
  }, {});
  

  return userBreaketTeams;
};
