'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('user', {
       firstName:DataTypes.STRING,
        lastName:DataTypes.STRING,
        userName:DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    countryCode: DataTypes.STRING,
    status: { type: DataTypes.INTEGER, field: 'status' },
    role: DataTypes.INTEGER,
    stateId: DataTypes.INTEGER,
    countryId: DataTypes.INTEGER,
    isSubscribed: DataTypes.INTEGER,
    accepTermConditions: DataTypes.INTEGER,
    verifyEmailToken:DataTypes.STRING,
    admin: {type: Boolean, required: true},
    isDeleted:{type:Boolean,default:false},
    emailVerified: { type: DataTypes.INTEGER, field: 'email_verified' },
    resetPasswordToken: { type: DataTypes.STRING, field: 'reset_password_token' },
    resetPasswordExpires: { type: DataTypes.STRING, field: 'reset_password_expires' },
    date_of_birth:DataTypes.STRING

  }, {});
  User.associate = (models) => {
       User.hasOne(models.devices);
      User.hasMany(models.user_images);
  }

  return User;
};
