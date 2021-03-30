'use strict';
const Joi = require('joi');
const signUp = Joi.object({
      body:{
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        userName: Joi.string().min(3).max(50).required(),
        email:Joi.string().email().required(),
        countryCode:Joi.any(),
        accepTermConditions:Joi.any(),
        isSubscribed:Joi.any().required(),
        stateId:Joi.any(),
        countryId:Joi.any().required(),     
        date_of_birth:Joi.date().required(),
        confirmPassword: Joi.any().valid(Joi.ref('password')).required(),
        role:Joi.number().required(),
        phoneNumber: Joi.any(),       
        password: Joi.string().min(8).required(),
        gender: Joi.string().required(),
        admin: Joi.number().min(0).max(1).default(0),
      }
});
const login = Joi.object({
      body: {
        password: Joi.string().required(),
        userName: Joi.any(),
        email:Joi.any(),
      }
});
const forgotPassword =  Joi.object({
      body: {
        userName: Joi.any(),
        email:Joi.any(),
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
