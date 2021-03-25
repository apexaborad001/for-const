'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = (sequelize, DataTypes) => {

  const tournamentTeams = sequelize.define('tournament_team', {
    	team_id: DataTypes.INTEGER,
	name: DataTypes.STRING,
	image:DataTypes.STRING,
	thumbnails: DataTypes.STRING,
	current_subseason_ids: DataTypes.STRING,
	gender: DataTypes.STRING,
	league_id: DataTypes.INTEGER,
	current_score: DataTypes.INTEGER

  }, {});
  

  return tournamentTeams;
};
