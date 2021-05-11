'use strict';

var jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

let isAuthenticated = (req, res, next) => {
  let access_token = req.body.token || req.query.token || req.headers['access_token'];
  let device_type = req.headers['device_type'];
  if (access_token) {
    jwt.verify(access_token, process.env.SECRET_KEY, async(err, decoded) => {
      if (err) {
        return res.status(413).send({
          status: false,
          message: 'Token Invalid',
          code: 413
        });
      } else {
        req.decoded = decoded;
        let userInfo = await req.models.user.findOne({
          attributes:["id", "userName", "status", "admin", "email"],
          where: {
            id: req.decoded.user_id,
            isDeleted: {
              [Op.ne]: req.constants.IS_DELETED
            }
          },
          include: [{
            attributes:["accessToken", "id"],
            model: req.models.devices,
            where: {
              accessToken : access_token
            }
		  }
		  ]           
        });
        userInfo = JSON.parse(JSON.stringify(userInfo, null, 4));
        
        if (!userInfo) {
          return res.status(413).send({
            status: false,
            message: 'Your session has expired. Kindly Login again.',
            code: 413
          });
        } else {
         if(userInfo.status){
            req.decoded.userName = userInfo.userName;
            req.decoded.status = userInfo.status;
            req.decoded.admin = userInfo.admin;
            req.decoded.email = userInfo.email;
          }

        }
        next();
      }
    })
  } else {
    res.status(403).send({
      status: false,
      message: 'Please send a token'
    });
  }

}



module.exports = {
  isAuthenticated
}
