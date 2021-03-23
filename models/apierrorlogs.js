'use strict';
module.exports = (sequelize, DataTypes) => {
  const apiErrorLogs = sequelize.define('apiErrorLogs', {
    apiName: DataTypes.STRING,
    apiUrl: DataTypes.STRING,
    responseBody: DataTypes.TEXT,
    userId : DataTypes.INTEGER,
    userType : DataTypes.ENUM({
      values: ['guest', 'user']
    }),
    deviceType : DataTypes.STRING,
    device : DataTypes.STRING,
    requestBody: DataTypes.TEXT
  }, {});
  apiErrorLogs.associate = function(models) {
    // associations can be defined here
  };
  return apiErrorLogs;
};