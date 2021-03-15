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
  }, {});
  User.associate = (models) => {
       User.hasOne(models.devices);
  }

  User.getChildList = async function(req) {

    let sql = `SELECT users.id as childId, first_name as firstName, last_name as lastName,gender, date_of_birth as dateOfBirth,
    (CASE WHEN userImages.image_path IS NOT NULL THEN CONCAT("${req.constants.PATIENTS_IMAGE_URL}",userImages.image_path,"/",userImages.name) ELSE "${req.constants.PATIENT_DEFAULT_IMAGE_URL}" END) profileImage,(CASE WHEN userImages.image_path IS NOT NULL THEN CONCAT("${req.constants.PATIENTS_IMAGE_URL}",userImages.image_path,"/thumb_",userImages.name) ELSE "${req.constants.PATIENT_DEFAULT_IMAGE_URL}" END) profileThumbImage, userImages.image_path as createdTimeSpan FROM users INNER JOIN patients ON users.id = patients.user_id LEFT JOIN (SELECT * from user_images WHERE image_type = "profile_image") as userImages on patients.user_id = userImages.user_id WHERE users.status = ${req.constants.ACTIVE} AND users.isDeleted != ${req.constants.IS_DELETED} AND users.parentId = ${req.decoded.user_id} ORDER BY patients.first_name, patients.last_name`;

    let children = req.database.query(sql, { type: req.database.QueryTypes.SELECT });
    return children;

  }

  User.getChildDetails = async function(req) {

    let sql = `SELECT users.id as childId, first_name as firstName, last_name as lastName,gender, date_of_birth as dateOfBirth,
    (CASE WHEN userImages.image_path IS NOT NULL THEN CONCAT("${req.constants.PATIENTS_IMAGE_URL}",userImages.image_path,"/",userImages.name) ELSE "${req.constants.PATIENT_DEFAULT_IMAGE_URL}" END) profileImage,(CASE WHEN userImages.image_path IS NOT NULL THEN CONCAT("${req.constants.PATIENTS_IMAGE_URL}",userImages.image_path,"/thumb_",userImages.name) ELSE "${req.constants.PATIENT_DEFAULT_IMAGE_URL}" END) profileThumbImage, userImages.image_path as createdTimeSpan FROM users INNER JOIN patients ON users.id = patients.user_id LEFT JOIN (SELECT * from user_images WHERE image_type = "profile_image") as userImages on patients.user_id = userImages.user_id WHERE users.status = ${req.constants.ACTIVE} AND users.isDeleted != ${req.constants.IS_DELETED} AND users.parentId = ${req.decoded.user_id} AND users.id = ${req.params.childId} ORDER BY patients.first_name, patients.last_name`;

    let child = req.database.query(sql, { type: req.database.QueryTypes.SELECT });
    return child;

  }

  User.hasChild = async function(req, userId) {

      let sql = `SELECT id FROM users WHERE parentId = ${userId}`;
      
      let child = req.database.query(sql, { type: req.database.QueryTypes.SELECT });
      return child
  }

  return User;
};
