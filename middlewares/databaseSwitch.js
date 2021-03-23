const constantsJs = require("../constants.js");
const models = require("../models");
const fs = require('fs');
const path = require('path');
dbSwitch = async(req, res, next) => {
    try{		
		req.database = models.sequelize;
		req.models = models;
		let {constants, messages} = constantsJs(req);
		req.constants = constants;
		req.messages = messages;
		next();
    }catch(err){
    	console.log(err);
    }
}
module.exports = dbSwitch;
