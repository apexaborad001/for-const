'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = (sequelize, DataTypes) => {

  const tournamentBreakets = sequelize.define('tournament_breaket', {
	bracket_id: DataTypes.INTEGER,      
	devision: DataTypes.STRING(100),
	round_labels: DataTypes.TEXT,
	subseason_id:DataTypes.INTEGER, 
  }, {});
  /*tournamentBreakets.associate = (models) => {
       User.hasOne(models.devices);
      User.hasMany(models.user_images);
  }
*/
  return tournamentBreakets;
};
