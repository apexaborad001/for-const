'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = (sequelize, DataTypes) => {

  const userBreaket = sequelize.define('user_breaket', {
    user_id:DataTypes.INTEGER,
    name:DataTypes.STRING,
    bracket_type:DataTypes.STRING
  }, {});
  

  return userBreaket;
};
