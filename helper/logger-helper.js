const jwt = require('jsonwebtoken');
var crypto = require('crypto');
const nodemailer = require("nodemailer");
const Sequelize = require('sequelize');
let path = require("path");
let fs = require("fs");
handlebars = require('handlebars');
let User = require("../models/user");
let helper = require("../helper/common-helper")

let log = async(...args) => {
  try {
    //console.log("error",args[2])
    let reqBody = {...args[1].body, ...args[1].headers, ...args[1].query, ...args[1].params }
    if (args[1].constants.is_debug) {
      let res = [];
      res.push(args[2])
      if (args[1].constants.DEBUG_TYPE == "email") {

        let from_id = process.env.fromId,
          to_id = "surendramaurya@mobikasa.com",
          subject = (args[6]) ? 'API Log' : 'API Error Logs',
          template_name = 'apiErrorLogs.html',
          replacements = {
            apiName: JSON.stringify(args[0]),
            apiUrl: args[1].BASE_URL + "api/v1" + args[1].url,
            responseBody: JSON.stringify(res),
            userType: JSON.stringify(args[3]),
            deviceType: JSON.stringify(args[1].headers.device_type),
            device: JSON.stringify(args[1].headers.device),
            userId: Number(args[4]),
            requestBody: JSON.stringify(reqBody),
            requestedOn: new Date()
          };


        helper.sendEmail(from_id, to_id, subject, template_name, replacements);

      } else if (args[1].constants.DEBUG_TYPE == "database") {
        args[1].models.apiErrorLogs.create({
          apiName: args[0],
          apiUrl: args[1].url,
          userType: args[3],
          deviceType: JSON.stringify(args[1].headers.device_type),
          device: JSON.stringify(args[1].headers.device),
          userId: Number(args[4]),
          requestBody: JSON.stringify(reqBody),
          responseBody: JSON.stringify(res)
        });
      } else if (args[1].constants.DEBUG_TYPE == "both") {

        let from_id = process.env.fromId,
          to_id = "surendramaurya@mobikasa.com",
          subject = (args[6]) ? 'API Log' : 'API Error Logs',
          template_name = 'apiErrorLogs.html',
          replacements = {
            apiName: JSON.stringify(args[0]),
            apiUrl: args[1].BASE_URL + "api/v1" + args[1].url,
            userType: JSON.stringify(args[3]),
            deviceType: JSON.stringify(args[1].headers.device_type),
            device: JSON.stringify(args[1].headers.device),
            userId: Number(args[4]),
            requestBody: JSON.stringify(reqBody),
            responseBody:  JSON.stringify(res),
            requestedOn: new Date()
          };

        helper.sendEmail(from_id, to_id, subject, template_name, replacements);

        args[1].models.apiErrorLogs.create({
          apiName: JSON.stringify(args[0]),
          apiUrl: JSON.stringify(args[1].url),
          userType: args[3],
          deviceType: JSON.stringify(args[1].headers.device_type),
          device: JSON.stringify(args[1].headers.device),
          userId: Number(args[4]),
          requestBody: JSON.stringify(reqBody),
          responseBody:  JSON.stringify(res),
        });
      }
    }
  } catch (err) {
    let from_id = process.env.fromId,
    to_id = "surendramaurya@mobikasa.com",
    subject = 'API Error Logs',
    template_name = 'apiErrorLogs.html';
    
    replacements = {
      apiName: "logger helper",
      error: err,
      requestedOn: new Date()
    }

    helper.sendEmail(from_id, to_id, subject, template_name, replacements);
  }

}

module.exports = {
  log: async(...args) => {

    log(...args);

  }
}
