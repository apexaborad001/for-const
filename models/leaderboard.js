'use strict';
module.exports = (sequelize, DataTypes) => {
  const leaderboard = sequelize.define('leaderboard', {
    userId: DataTypes.INTEGER,
    userName: DataTypes.STRING,
    bracketType: DataTypes.STRING,
    score: DataTypes.INTEGER
  }, {});
  leaderboard.associate = function(models) {
    // associations can be defined here
  };
  return leaderboard;
};