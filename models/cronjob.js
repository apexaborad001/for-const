'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = (sequelize, DataTypes) => {

  const cronjob = sequelize.define('cronjob', {
    callApiAt: {
        allowNull: false,
        type: DataTypes.DATE
    },
    api:DataTypes.STRING,
    status: {
		type: DataTypes.TINYINT,
		allowNull: false,
		defaultValue: 1
	},
    response:DataTypes.STRING,
  }, {});
  return cronjob;
};
