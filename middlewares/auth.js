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
          attributes:["id", "userName", "status", "admin"],
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
            req.decoded.status = userInfo.status;
            req.decoded.admin = userInfo.admin;
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

let hasAccess = (req, res, next) => {
  let role = req.decoded.role;
  if (req.decoded.status === req.constants.BLOCKED) {
    return res.status(req.constants.HTTP_FORBIDDEN).json({
      status: req.constants.ERROR,
      code: req.constants.LOGOUT_USER,
      message: req.messages.LOGIN.BLOCKED
    })
  }
  // Check user role is admin or superadmin
  if (role === req.constants.USER_TYPE.superadmin || role === req.constants.USER_TYPE.admin) {
    next();
  } else {
    if (role === req.constants.USER_TYPE.staff) {
      let actionName = req.route.path;
      const blocked_url_readonly = ["/admin/saveInfoPages", "/admin/saveQuestionnaire", "/admin/deleteQuestionnaire/:id", "/admin/updateQuestionnaireOrder", "/admin/registerAdmin", "/admin/updateAdmin","/admin/deleteAdmin",
                  "/admin/updateAdminStatus","/admin/createProvider","/admin/updateProvider","/admin/deleteProvider/:id",
                  ,"/admin/updateProfile", "/admin/deletePatient/:id","/admin/changeProviderStatus", "/admin/changePatientStatus",
                  "/admin/updateInsuranceStatus","/admin/uploadProfilePhoto", "/admin/addPromoCode", "/admin/updatePromoCode", "/admin/addClinicCode","/admin/saveAppVersion", "/admin/saveOnboardingData"]; 
      
      const is_valid_url = blocked_url_readonly.every((currentValue) => !actionName.includes(currentValue));
      if(is_valid_url){
       return next();
      }

    }
    return res.status(req.constants.HTTP_FORBIDDEN).send({
      code: req.constants.HTTP_FORBIDDEN,
      status: req.constants.ERROR,
      message: 'Un-authorized access'
    });
  }

}
let hasAccessForProvider = (req, res, next) => {
  let role = req.decoded.role;
  // Check user role is admin or superadmin or provider
  if (role === req.constants.USER_TYPE.superadmin || role === req.constants.USER_TYPE.admin || role === req.constants.USER_TYPE.provider) {
    next();
  } else {
    return res.status(req.constants.HTTP_FORBIDDEN).send({
      code: req.constants.HTTP_FORBIDDEN,
      status: req.constants.ERROR,
      message: 'Un-authorized access'
    });
  }
}

module.exports = {
  isAuthenticated,
  hasAccess,
  hasAccessForProvider
}
