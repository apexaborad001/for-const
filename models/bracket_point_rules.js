'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = (sequelize, DataTypes) => {

  const bracketPointRules = sequelize.define('bracket_point_rule', {
    league_id:DataTypes.INTEGER,
    bracket_id:DataTypes.STRING,
    round: DataTypes.INTEGER,
    point: DataTypes.INTEGER
  }, {});
  
  return bracketPointRules;
};
