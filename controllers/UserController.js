const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const helper = require('../helper/common-helper');
const logger = require('../helper/logger-helper');
const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
const crypto = require("crypto");
const editProfile = async(req,res) =>{  
        try{
            const user_id = req.decoded.user_id;
            let userData = await req.models.user.findOne({attributes:{exclude:["password"]}, where:{id:user_id}});
            let keyToUpdate = ["firstName", "lastName", "gender", "phoneNumber", "email", "date_of_birth"];
            for(let key of keyToUpdate){ 
            	if(req.body[key]) userData[key] = req.body[key]
            }
            await userData.save();
            let data = userData;
            if(req.files){
                try{
					let imageRes = await helper.upload(req, "myprofile");
          return res.status(200).json({ "imf":imageRes });

					imageRes["userId"] = req.decoded.user_id;
					await req.models.user_images.destroy({
                    	where:{
                    		userId:req.decoded.user_id
                    	}
                    })
					let saveImage = new req.models.user_images(imageRes)
					await saveImage.save()
                }catch(err){
                    console.log(err)
                }
            }
            return res.status(req.constants.HTTP_SUCCESS).json({ 
                status: req.constants.SUCCESS, 
                code: req.constants.HTTP_SUCCESS,
                data: data, 
                message: "Your profile has been successfully updated "
            });
        }catch(err){
            //console.log(err)
           return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + error });
        }
    };


const signUp = async(req, res) => {   
    try {    
        let email = req.body.email;         
        let password = bcrypt.hashSync(req.body.password);
        let findUser = await req.models.user.findOne({
          where: {
            [Op.or]:[
                            {userName: req.body.userName},
                            {email: req.body.email}
                          ]
              
          }
        });
        if (findUser) {
          return res.status(req.constants.HTTP_ALREADY_EXISTS).json({ status: req.constants.ERROR, code: req.constants.HTTP_ALREADY_EXISTS, message: req.messages.SIGNUP.ALREADY_EXISTS });
        } else {
          let userData = {
            password: password,
            email: email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            phoneNumber: req.body.phoneNumber,
            countryCode: req.body.countryCode,
            gender: req.body.gender,
            role: req.body.role,
            stateId: req.body.stateId,
            countryId: req.body.countryId,
            date_of_birth:req.body.date_of_birth,
            isSubscribed:req.body.isSubscribed,
            accepTermConditions:req.body.accepTermConditions,
            otp_verified:1,
            otp_verified:1,
            email_verified:0,
            status:1
        };
        
          let newUserData = await req.models.user.create(userData);
			if(req.files){
                try{
					let imageRes = await helper.upload(req, "myprofile");
					imageRes["userId"] = newUserData.id;
            		let saveImage = new req.models.user_images(imageRes)
					await saveImage.save()
			    }catch(err){
                    console.log(err)
                }    
            }
			      let token = email + newUserData.id;
      let verifyEmailToken = await helper.generateVerificationEmail(token);
      let verifyEmailLink = `${req.BASE_URL_FRONTEND}` + "verify-email" + "/" + verifyEmailToken;
      await req.models.user.update({ verifyEmailToken: verifyEmailToken}, { where: { id: newUserData.id } })
      let template = "WelcomeEmail.html";

			let to_id = email,
			subject = req.messages.MAIL_SUBJECT.WELCOME_MAIL,
			template_name = template,
			replacements = { user: req.body.fullName, url:req.BASE_URL_FRONTEND, date: moment(new Date()).format("MMMM Do YYYY"), verifyEmailLink };
			helper.sendEmail(process.env.mailFrom, to_id, subject, template_name, replacements);
	  	  return res.status(req.constants.HTTP_SUCCESS).json({ status: req.constants.SUCCESS, code: req.constants.HTTP_SUCCESS, message: req.messages.SIGNUP.SUCCESS});  
         }               
    } catch (error) {
      logger.log('Create Admin', req, error, 'user', req.decoded.user_id);
      res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + error });
    }
  };
  
    
  const login =  async(req, res) => { 
    let userName = req.body.userName || "";
    let email = req.body.email || "";
    let password = req.body.password;
    try {
        var response = await req.models.user.findOne({
        	where: { isDeleted : 0, 
            [Op.or]:[
              {userName: userName},
              {email: email}
            ]
          },
      	});
      	response = JSON.parse(JSON.stringify(response, null, 4));
        
        if(response.emailVerified != 1){
          return res.status(req.constants.HTTP_NOT_EXISTS).json({
		        status: req.constants.ERROR,
		        code: req.constants.HTTP_NOT_EXISTS,
		        message: "please activate your account"
		      });
        }
      	if(response){
        let otp_verified = response.otpVerified;
        let comparedPassword = await bcrypt.compareSync(password, response.password);
        if (comparedPassword) {
		      if (response.status !== req.constants.BLOCKED) { 
		        let accessToken = await helper.createAccessToken(response.email, response.id, req.database, response.fullName, req.models); 
				res.set({
					'access_token': accessToken
				});
				let data = {
					fullName:response.fullName,
					email:response.email
				}
				return res.status(req.constants.HTTP_SUCCESS).send({
					code: req.constants.HTTP_SUCCESS,
					status: req.constants.SUCCESS,
					message: req.messages.LOGIN.SUCCESS,
					data:data
				}) 
		    } else {
		      logger.log('Login', req, {
		        status: req.constants.ERROR,
		        code: req.constants.HTTP_NOT_EXISTS,
		        message: req.messages.LOGIN.FAILURE
		      }, 'guest', 0);
		      return res.status(req.constants.HTTP_NOT_EXISTS).json({
		        status: req.constants.ERROR,
		        code: req.constants.HTTP_NOT_EXISTS,
		        message: req.messages.LOGIN.BLOCKED
		      });
		    }
        } else {
          logger.log('Login', req, {
            status: req.constants.ERROR,
            code: req.constants.HTTP_NOT_EXISTS,
            message: req.messages.LOGIN.FAILURE
          }, 'guest', 0);
          return res.status(req.constants.HTTP_NOT_EXISTS).json({
            status: req.constants.ERROR,
            code: req.constants.HTTP_NOT_EXISTS,
            message: req.messages.LOGIN.FAILURE
          });
        }
      } else {
        logger.log('Login', req, {
          status: req.constants.ERROR,
          code: req.constants.HTTP_NOT_EXISTS,
          message: req.messages.LOGIN.NOT_FOUND
        }, 'guest', 0);
        res.status(req.constants.HTTP_NOT_EXISTS).json({
          status: req.constants.ERROR,
          code: req.constants.HTTP_NOT_EXISTS,
          message: req.messages.LOGIN.NOT_FOUND
        })
      }
    } catch (err) {
      logger.log('Login', req, err, 'guest', 0);
      res.status(req.constants.HTTP_SERVER_ERROR).json({
        status: req.constants.ERROR,
        code: req.constants.HTTP_SERVER_ERROR,
        message: req.messages.INTERNAL500 + err
      })
    }
  }
  
const getUser = async(req, res) => {   
  try {    
      let userId=req.decoded.user_id
      let findUser = await req.models.user.findOne({
        attributes:{exclude:['password']},
        where: {
          id: userId
        },
        include:[{
        	model:req.models.user_images,
            attributes:['name', 'image_path'],
        	
        }]
      });
        if(findUser)
        {
            res.status(req.constants.HTTP_SUCCESS).send({
            code: req.constants.HTTP_SUCCESS,
            status: req.constants.SUCCESS,
            message: req.messages.USER_PROFILE.SUCCESS,
            data:findUser,
            s3url:process.env.BUCKET_ACCESS_URL
          }) 
        }
        else{
          logger.log('getUser', req, err, 'user',userId);
          res.status(req.constants.HTTP_NOT_FOUND).send({
            code: req.constants.HTTP_NOT_FOUND,
            status: req.constants.ERROR,
            message: req.messages.USER_PROFILE.UNSUCCESSFULL,
            })
        }
      }catch(err){ //console.log(err);
        logger.log('getUser', req, err, 'user', userId);
        res.status(req.constants.HTTP_SERVER_ERROR).json({
          status: req.constants.ERROR,
          code: req.constants.HTTP_SERVER_ERROR,
          message: req.messages.INTERNAL500 + err
        })
    }
  }

  
  
   const logout = async function(req, res) {
    try {
      let device = req.models.devices.findOne({
        where: {
          userId: req.decoded.user_id,
          accessToken: req.headers["access_token"]
        }
      });
      if (device) {
        await req.models.devices.destroy({
          where: {
            userId: req.decoded.user_id,
            accessToken: req.headers["access_token"]
          }
        });
        return res.status(req.constants.HTTP_SUCCESS).json({
          status: req.constants.SUCCESS,
          code: req.constants.HTTP_SUCCESS,
          message: req.messages.LOGOUT.SUCCESSFULL
        });

      }else{
        return res.status(req.constants.HTTP_SUCCESS).json({
          status: req.constants.ERROR,
          code: req.constants.HTTP_SUCCESS,
          message: req.messages.LOGOUT.UNSUCCESSFULL
        });

      }

    } catch (err) {
      logger.log('Logout User', req, err, 'user', req.decoded.user_id);
      return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, code: req.constants.HTTP_SERVER_ERROR, message: req.messages.INTERNAL500 + err })
    }

  }
  
   
  const forgotPassword = async(req, res) => {
    try {
      let userName = req.body.userName;
      let userInfoQuery = `SELECT id,email, fullName from users where userName =  '${userName}'`
      let userInfo = await req.database.query(userInfoQuery, { type: req.database.QueryTypes.SELECT });
      if (userInfo.length > 0) {
          userInfo = userInfo[0];
          let token = userName + userInfo.id;
          let resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
          let resetPasswordExpires = (new Date()).getTime();
          await req.models.user.update({ resetPasswordToken: resetPasswordToken, resetPasswordExpires: resetPasswordExpires }, { where: { id: userInfo.id } })
          let resetLink = req.BASE_URL_FRONTEND + "reset-password" + "/" + resetPasswordToken;
          let name = userInfo.fullName;
          let template = "ForgotPassword.html";
          let to_id = userInfo.email,
            subject = req.messages.MAIL_SUBJECT.PASSWORD_RESET,
            template_name = template,
            replacements = { user: name, resetLink: resetLink, date: moment(new Date()).format("MMMM Do YYYY") };
           helper.sendEmail(process.env.mailFrom, to_id, subject, template_name, replacements);
           return res.status(req.constants.HTTP_SUCCESS).json({ status: req.constants.SUCCESS, code: req.constants.HTTP_SUCCESS, message: req.messages.FORGOT_PASSWORD.FOLLOW_EMAIL })
        
      } else {
        logger.log('Forgot Password', req, { status: req.constants.ERROR, code: req.constants.HTTP_BAD_REQUEST, message: req.messages.USER.NOT_FOUND }, 'user', 0);

        return res.status(req.constants.HTTP_NOT_EXISTS).json({ status: req.constants.ERROR, code: req.constants.HTTP_BAD_REQUEST, message: req.messages.USER.NOT_FOUND })
      }
    } catch (err) {
      logger.log('Forgot Password', req, err, 'user', req.decoded.user_id);
      return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, code: req.constants.HTTP_SERVER_ERROR, message: req.messages.INTERNAL500 + err })
    }
  }
  const verifyResetToken = async(req, res) => {
    try {
      let resetToken = req.params.token,
        userInfo = await req.models.user.findOne({ where: { resetPasswordToken: resetToken } });
      if (userInfo != null) {
        let expTime = 86400000, // 1 Day
          expiresIn = userInfo.resetPasswordExpires,
          currTime = (new Date()).getTime(),
          timeDiff = Math.ceil((Math.abs(currTime - expiresIn) / 1000) % 60);
        if (timeDiff > expTime) {
          res.status(401).send({
            status: false,
            code: 401,
            message: req.messages.RESET_TOKEN.EXPIRED
          });
        } else {
          res.status(req.constants.HTTP_SUCCESS).json({ status: req.constants.SUCCESS, code: req.constants.HTTP_SUCCESS, message: req.messages.RESET_TOKEN.VERIFIED });
        }
      } else {
        logger.log('Verify Reset Token', req, { status: req.constants.ERROR, code: req.constants.HTTP_BAD_REQUEST, message: req.messages.RESET_TOKEN.UN_AUTHORIZED }, 'user', 0);
        res.status(req.constants.HTTP_FORBIDDEN).json({ status: req.constants.ERROR, code: req.constants.HTTP_BAD_REQUEST, message: req.messages.RESET_TOKEN.UN_AUTHORIZED })
      }
    } catch (err) {
      logger.log('Verify Reset Token', req, err, 'user', 0);
      res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, code: req.constants.HTTP_SERVER_ERROR, message: req.messages.INTERNAL500 + err })
    }
  }
  const resetPassword = async(req, res) => {
    try {
      let resetToken = req.params.token,
        password = req.body.password,
        userInfo = await req.models.user.findOne({ where: { resetPasswordToken: resetToken } });
      if (userInfo != null) {
        let expTime = 86400000, // 1 Day
          expiresIn = userInfo.resetPasswordExpires,
          currTime = (new Date()).getTime(),
          timeDiff = Math.ceil((Math.abs(currTime - expiresIn) / 1000) % 60);
        if (timeDiff > expTime) {
          return res.status(req.constants.HTTP_NOT_EXISTS).send({
            status: false,
            code: req.constants.HTTP_NOT_EXISTS,
            message: req.messages.RESET_TOKEN.EXPIRED
          });
        } else {
          await req.models.user.update({ password: bcrypt.hashSync(password), resetPasswordToken: '', resetToken: '' }, { where: { id: userInfo.id } });
          return res.status(req.constants.HTTP_SUCCESS).json({
            status: req.constants.SUCCESS,
            code: req.constants.HTTP_SUCCESS,
            message: req.messages.USER.PASSWORD_UPDATED
          });
        }
      } else {
        logger.log('Reset Password', req, { status: req.constants.ERROR, code: req.constants.HTTP_BAD_REQUEST, message: req.messages.RESET_TOKEN.EXPIRED }, 'user', 0);
        return res.status(req.constants.HTTP_BAD_REQUEST).json({ status: req.constants.ERROR, code: req.constants.HTTP_BAD_REQUEST, message: req.messages.RESET_TOKEN.EXPIRED })
      }
    } catch (err) {
      logger.log('Reset Password', req, err, 'user', 0);
      res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, code: req.constants.HTTP_SERVER_ERROR, message: req.messages.INTERNAL500 + err })
    }
  }
  const changePassword =  async(req, res, next) => {
    try {
      let id = req.decoded.user_id;
      let old_password = req.body.oldPassword;
      let new_password = req.body.newPassword;
      let userInfo = await req.models.user.findOne({
        where: {
          id: id
        }
      });
      userInfo = JSON.parse(JSON.stringify(userInfo));
      if (userInfo) {
        let comparedPassword = await bcrypt.compareSync(old_password, userInfo.password);
        if (comparedPassword) {
          compareNewPassword = await bcrypt.compareSync(new_password, userInfo.password);
          if (compareNewPassword) {
            return res.status(req.constants.HTTP_BAD_REQUEST).json({ status: req.constants.ERROR, code: req.constants.HTTP_BAD_REQUEST, message: req.messages.CHANGE_PASSWORD.PROMT_NEW_PASSWORD })
          } else {
            let isUpdated = await req.models.user.update({
              password: await bcrypt.hashSync(new_password)
            }, {
              where: {
                id: id
              }
            });
            return res.status(req.constants.HTTP_SUCCESS).json({ status: req.constants.SUCCESS, code: req.constants.HTTP_SUCCESS, message: req.messages.CHANGE_PASSWORD.SUCCESSFUL })
          }
        } else {
          logger.log('Change Password', req, { status: req.constants.ERROR, code: req.constants.HTTP_BAD_REQUEST, message: req.messages.CHANGE_PASSWORD.OLD_INCORRECT }, 'user', req.decoded.user_id);
         return res.status(req.constants.HTTP_BAD_REQUEST).json({ status: req.constants.ERROR, code: req.constants.HTTP_BAD_REQUEST, message: req.messages.CHANGE_PASSWORD.OLD_INCORRECT })
        }
      } else {
        logger.log('Change Password', req, { status: req.constants.ERROR, code: req.constants.HTTP_NOT_EXISTS, message: req.messages.USER.NOT_FOUND }, 'user', req.decoded.user_id);
        return res.status(req.constants.HTTP_NOT_EXISTS).json({ status: req.constants.ERROR, code: req.constants.HTTP_NOT_EXISTS, message: req.messages.USER.NOT_FOUND })
      }

    } catch (err) {
      logger.log('Change Password', req, err, 'user', req.decoded.user_id);
      return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, code: req.constants.HTTP_SERVER_ERROR, message: req.messages.INTERNAL500 + err })
    }
  }
 
  const verifyEmailToken = async(req,res) =>{
    try{
         let verifyEmailToken = req.params.verifyEmailToken;
        let tokenExists = await req.models.user.findOne({ where: {verifyEmailToken:verifyEmailToken}})
       //  console.log(tokenExists)
         if(tokenExists){

           
             let isUpdated = await req.models.user.update({
              emailVerified : 1,
              verifyEmailToken:" "
            }, {
              where: {
                id:tokenExists.id
              }
            });
          //  console.log(isUpdated)

            return res.status(req.constants.HTTP_SUCCESS).json({ status: req.constants.SUCCESS, code: req.constants.HTTP_SUCCESS, message: "email verified successfully" })
         }else{
		      return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, code: req.constants.HTTP_SERVER_ERROR, message: "Invalid token details" })
         }
         } catch (err) { //console.log(err);
      logger.log('Change Password', req, err, 'user', req.decoded.user_id);
      return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, code: req.constants.HTTP_SERVER_ERROR, message: req.messages.INTERNAL500 + err })
    }
    }
  
module.exports = {
login,
signUp, 
editProfile,
logout,
getUser,
forgotPassword,
verifyResetToken,
resetPassword,
changePassword,
verifyEmailToken
};

