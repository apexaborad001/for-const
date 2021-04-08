'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = (sequelize, DataTypes) => {

  const tournamentGames = sequelize.define('tournament_game', {
	game_id: DataTypes.INTEGER,
	team_1_id:DataTypes.INTEGER,
	team_2_id: DataTypes.INTEGER,
	winner_id: DataTypes.INTEGER,
	looser_id: DataTypes.INTEGER,
	round: DataTypes.INTEGER,
	position: DataTypes.INTEGER,
	bracket_id: DataTypes.INTEGER,
	game_start_time: DataTypes.DATE,
	game_end_time: DataTypes.DATE,      
	location: DataTypes.STRING,
	timezone: DataTypes.STRING,
	winner_score: DataTypes.INTEGER,
	looser_score: DataTypes.INTEGER,
	team1_score: DataTypes.INTEGER,
	team2_score: DataTypes.INTEGER
    
  }, {});
/*  User.associate = (models) => {
       User.hasOne(models.devices);
      User.hasMany(models.user_images);
  }*/

  return tournamentGames;
};
