'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = (sequelize, DataTypes) => {

  const tournamentLeagues = sequelize.define('tournament_league', {
    league_id:DataTypes.INTEGER,
    name:DataTypes.STRING,
    current_subseason_id: DataTypes.INTEGER,
    site_id: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    abbrev: DataTypes.STRING,

  }, {});
  
  return tournamentLeagues;
};
