'use strict';
const Joi = require('joi');
const signUp = Joi.object({
      body:{
        fullName: Joi.string().required(),
        userName: Joi.string().alphanum().min(3).max(50).required(),
        email:Joi.string().email(),
        password: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        gender: Joi.string().required(),
        admin: Joi.number().min(0).max(1).default(0),
        countryCode:Joi.any()
        
      },
      headers: {
        device_token: Joi.any().default(''),
        device_type: Joi.any().default(''),
        device_id: Joi.any().default(''),
        app_version: Joi.any().default(''),
        device: Joi.any().default(''),
        badge: Joi.any().default(''),
      }
  });
const login = Joi.object({
      body: {
        password: Joi.string().required(),
        userName: Joi.string().required(),
      },
      headers: {
        device_token: Joi.any().default(''),
        device_type: Joi.any().default(''),
        device_id: Joi.any().default(''),
        app_version: Joi.any().default(''),
        device: Joi.any().default(''),
        badge: Joi.any().default(''),
      }
    });
const forgotPassword =  Joi.object({
      body: {
        password: Joi.string().required(),
        userName: Joi.string().required(),
        oldPassword:Joi.string().required()
      }
    });
module.exports = {
  login,
  signUp,
  forgotPassword
}
