'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = (sequelize, DataTypes) => {

  const userBreaketTeams = sequelize.define('user_breaket_team', {
    user_bracket_id:DataTypes.INTEGER,
    team_id:DataTypes.INTEGER,
    game_id: DataTypes.INTEGER,
    password: DataTypes.STRING,
    type:DataTypes.STRING
  }, {});
  

  return userBreaketTeams;
};
