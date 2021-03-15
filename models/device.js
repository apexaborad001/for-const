'use strict';
module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('devices', {
    deviceToken: { type: DataTypes.STRING, field: 'device_token' },
    deviceId: { type: DataTypes.STRING, field: 'device_id' },
    deviceType: { type: DataTypes.STRING, field: 'device_type' },
    appVersion: { type: DataTypes.STRING, field: 'app_version' },
    badge: DataTypes.STRING,
    userId: { type: DataTypes.INTEGER, field: 'user_id' },
    accessToken: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  Device.associate = function(models) {
    // associations can be defined here    
    Device.belongsTo(models.user);

  };
  return Device;
};
