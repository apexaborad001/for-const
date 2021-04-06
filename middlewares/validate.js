const Joi = require('joi');
var Extend = require('extend');
const logger = require("../helper/logger-helper");
var options = {
	// return an error if body has an unrecognised property
	allowUnknown: false,
	stripUnknown: { objects: true },
	//stripUnknown: true,

	// return all errors a payload contains, not just the first one Joi finds
	abortEarly: false
};
module.exports = function validate(schema) {
	return function validateRequest(req, res, next) {
		try {
			if (!schema) {
				return next();
			}
			let resp = schema.validate(req, options);
			if (resp.error) {
				let keyName = resp.error.details[0].context.key;
				let labelName = resp.error.details[0].context.label;
				let message = resp.error.details[0].message;
				if (labelName && labelName.indexOf(".") !== -1) {
					message = message.replace(labelName, keyName);
				}
				return res.status(400).send({
					status: false,
					code: 400,
					message: message,
					errors: message
				});
			}
			let validatedData = JSON.parse(JSON.stringify(resp.value));
			Extend(req, validatedData);
			return next();
		} catch (err) {
			console.log(err);
		}
	}
};
