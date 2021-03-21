'use strict';
const Joi = require('joi');
const signUp = Joi.object({
      body:{
        fullName: Joi.string().required(),
        userName: Joi.string().alphanum().min(3).max(50).required(),
        email:Joi.string().email(),
        password: Joi.string().min(8).required(),
        phoneNumber: Joi.string().required(),
        gender: Joi.string().required(),
        admin: Joi.number().min(0).max(1).default(0),
        countryCode:Joi.any()       
      }
  });
const login = Joi.object({
      body: {
        password: Joi.string().required(),
        userName: Joi.string().required(),
      }
    });
const forgotPassword =  Joi.object({
      body: {
        userName: Joi.string().required(),
      }
    });
const verifyResetToken =  Joi.object({
		params: {
			token: Joi.string().required(),
		}
    });
const resetPassword =  Joi.object({
		params: {
			token: Joi.string().required(),
		},
		body: {
			password: Joi.string().min(8).required(),
			confirmPassword: Joi.string().min(8).valid(Joi.ref('password')).required(),
		}
    });
    
const changePassword =  Joi.object({
      body: {
      	oldPassword: Joi.string().required(),
      	newPassword: Joi.string().min(8).required(),
      	confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required(),
      },
	  headers: {
		access_token: Joi.string().required()
	  }
    });
module.exports = {
  login,
  signUp,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  changePassword
}
