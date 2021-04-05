'use strict';
const Joi = require('joi');
const contactUs = Joi.object({
      body:{
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email:Joi.string().email().required(),
        message:Joi.any()
      }
});
const inviteFriend = Joi.object({
      body:{
        mail_to:Joi.string().email().required(),
        comment:Joi.string().required(),
      }
});
module.exports = {
  contactUs,
  inviteFriend
}
