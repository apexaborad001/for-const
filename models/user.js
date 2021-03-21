'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('user', {
    fullName:DataTypes.STRING,
    userName:DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    countryCode: DataTypes.STRING,
    status: { type: DataTypes.INTEGER, field: 'status' },
    admin: {type: Boolean, required: true},
    isDeleted:{type:Boolean,default:false},
    emailVerified: { type: DataTypes.STRING, field: 'email_verified' },
    //resetPasswordToken: { type: DataTypes.STRING, field: 'reset_password_token' },
    //resetPasswordExpires: { type: DataTypes.STRING, field: 'reset_password_expires' }
  }, {});
  User.associate = (models) => {
       User.hasOne(models.devices);
      User.hasMany(models.user_images);
  }

  return User;
};
