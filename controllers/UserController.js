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
            const isProfileRemoved = req.body.isProfileRemoved;
            let is_email_updated = false;
            let userData = await req.models.user.findOne({attributes:{exclude:["password"]}, where:{id:user_id}});
            /*if(req.body.email !=userData.email){
              let findUser = await req.models.user.findOne({
                attributes: ['id'],
                where: {
                  email: req.body.email
                }
              });
              if (findUser) {
                return res.status(req.constants.HTTP_ALREADY_EXISTS).json({ status: req.constants.ERROR, code: req.constants.HTTP_ALREADY_EXISTS, message: req.messages.USER_PROFILE.ALREADY_EXISTS });
              }
              is_email_updated = true;
              userData['emailVerified'] = 0;
            }*/
            let keyToUpdate = ["firstName", "lastName", "isSubscribed", "stateId", "countryId", "date_of_birth", "role", "phoneNumber", "gender"];
            for(let key of keyToUpdate){ 
            	if(req.body[key]) userData[key] = req.body[key]
            }
            await userData.save();
            let data = userData;
            
            if(isProfileRemoved){
              await req.models.user_images.destroy({
                where:{
                  userId:req.decoded.user_id
                }})
            }
            if(req.files){
                try{
					            let imageRes = await helper.upload(req, "myprofile");
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
            if(is_email_updated){
              let token = userData.email + userData.id;
              let verifyEmailToken = await helper.generateVerificationEmail(token);
              let verifyEmailLink = `${req.BASE_URL_FRONTEND}` + "verify-email" + "/" + verifyEmailToken;
              await req.models.user.update({ verifyEmailToken: verifyEmailToken}, { where: { id: userData.id } })
              let template = "VerifyEmail.html";
              let to_id = userData.email,
              subject = req.messages.MAIL_SUBJECT.ACTIVATE_MAIL,
              template_name = template,
              replacements = { user: req.body.firstName, url:req.BASE_URL_FRONTEND, date: moment(new Date()).format("MMMM Do YYYY"), verifyEmailLink };
              helper.sendEmail(process.env.mailFrom, to_id, subject, template_name, replacements);        
            }

            return res.status(req.constants.HTTP_SUCCESS).json({ 
                status: req.constants.SUCCESS, 
                code: req.constants.HTTP_SUCCESS,
                message: req.messages.USER_PROFILE.UPDATE_SUCCESS
            });
        }catch(err){
            //console.log(err)
           return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + err });
        }
    };


const signUp = async(req, res) => {   
    try {    
        let email = req.body.email;  
        let username=req.body.userName;       
        let password = bcrypt.hashSync(req.body.password);
        req.body.accepTermConditions = req.body.accepTermConditions || 1;
        let findUser = await req.models.user.findOne({
          where: {
                [Op.or]:[
                  {userName: req.body.userName},
                  {email: req.body.email}
                ]
          }
        });
        if (findUser) {
          if(findUser.emailVerified != 1){
            return res.status(req.constants.HTTP_NOT_EXISTS).json({
              status: req.constants.ERROR,
              code: req.constants.HTTP_NOT_EXISTS,
              message: "Verification link is already shared to this email, please verify to continue"
            });
          
          }
          
          if(email==findUser.get('email')&&username==findUser.get('userName'))
          {
            return res.status(req.constants.HTTP_ALREADY_EXISTS).json({ status: req.constants.ERROR, code: req.constants.HTTP_ALREADY_EXISTS, message: req.messages.SIGNUP.ALREADY_EXISTS });
          }
          else if(email==findUser.get('email'))
          {
            return res.status(req.constants.HTTP_ALREADY_EXISTS).json({ status: req.constants.ERROR, code: req.constants.HTTP_ALREADY_EXISTS, message: req.messages.SIGNUP.EMAIL_ALREADY_EXISTS });
          }
          else if(username==findUser.get('userName'))
          {
            return res.status(req.constants.HTTP_ALREADY_EXISTS).json({ status: req.constants.ERROR, code: req.constants.HTTP_ALREADY_EXISTS, message: req.messages.SIGNUP.USERNAME_ALREADY_EXISTS }); 
          }
        } else {
          let userData = {
            password: password,
            email: email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            phoneNumber: req.body.phoneNumber,
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
			replacements = { user: req.body.firstName, url:req.BASE_URL_FRONTEND, date: moment(new Date()).format("MMMM Do YYYY"), verifyEmailLink };
			helper.sendEmail(process.env.mailFrom, to_id, subject, template_name, replacements);
	    return res.status(req.constants.HTTP_SUCCESS).json({ status: req.constants.SUCCESS, code: req.constants.HTTP_SUCCESS, message: req.messages.SIGNUP.SUCCESS});  
    }               
    } catch (error) {
      logger.log('Sign UP', req, error, 'user', 0);
      res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + error });
    }
  };
  
    
  const login =  async(req, res) => { 
    let userName = req.body.userName || "";
    let email = userName;
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
        
       
      	if(response){
          if(response.emailVerified != 1){
            return res.status(req.constants.HTTP_NOT_EXISTS).json({
              status: req.constants.ERROR,
              code: req.constants.HTTP_NOT_EXISTS,
              message: req.messages.LOGIN.NOT_VERIFIED
            });
          }
        let otp_verified = response.otpVerified;
        let comparedPassword = await bcrypt.compareSync(password, response.password);
        if (comparedPassword) {
		      if (response.status !== req.constants.BLOCKED) { 
			await req.models.devices.destroy({where: { userId: response.id}});
		        
		        let accessToken = await helper.createAccessToken(response.email, response.id, req.database, response.firstName, req.models); 
				res.set({
					'access_token': accessToken
				});
				let data = {
					firstName:response.firstName,
					email:response.email,
          admin:response.admin
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
  let email = userName;
  let userInfoQuery = `SELECT id,email, firstName, reset_password_expires, email_verified from users where userName =  '${userName}' or email =  '${email}'`
   
  let userInfo = await req.database.query(userInfoQuery, { type: req.database.QueryTypes.SELECT });
  if (userInfo.length > 0) {
      userInfo = userInfo[0];
      if(userInfo.email_verified != 1){
            return res.status(req.constants.HTTP_NOT_EXISTS).json({
              status: req.constants.ERROR,
              code: req.constants.HTTP_NOT_EXISTS,
              message: "Your e-mail verification is pending, please check your inbox and verify first."
            });
      }
      let expiresIn = userInfo.reset_password_expires,
      currTime = (new Date()).getTime(),
      timeDiff = Math.ceil((Math.abs(currTime - expiresIn) / 1000) / 60);
      //console.log(timeDiff);
      if(timeDiff <= 1){
      	return res.status(req.constants.HTTP_SUCCESS).json({ status: req.constants.SUCCESS, code: req.constants.HTTP_SUCCESS, message: req.messages.FORGOT_PASSWORD.FOLLOW_EMAIL });
      }
      //console.log(timeDiff,"wwwwwwwwwwwwwww");
      let token = "";
      if(userName){
        token = userName + userInfo.id;
      }else{
        token = email + userInfo.id;
      }
      
      let resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
      let resetPasswordExpires = (new Date()).getTime();
      await req.models.user.update({ resetPasswordToken: resetPasswordToken, resetPasswordExpires: resetPasswordExpires }, { where: { id: userInfo.id } })
      let resetLink = req.BASE_URL_FRONTEND + "reset-password" + "/" + resetPasswordToken;
      let name = userInfo.firstName;
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
  logger.log('Forgot Password', req, err, 'user', 0);
  return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, code: req.constants.HTTP_SERVER_ERROR, message: req.messages.INTERNAL500 + err })
}
}
const verifyResetToken = async(req, res) => {
try {
  let resetToken = req.params.token,
    userInfo = await req.models.user.findOne({ where: { resetPasswordToken: resetToken } });
  if (userInfo != null) {
    let expTime = 1440, // 1 Day
      expiresIn = userInfo.resetPasswordExpires,
      currTime = (new Date()).getTime(),
      timeDiff = Math.ceil((Math.abs(currTime - expiresIn) / 1000) / 60);
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
    let expTime = 1440, // 1 Day
      expiresIn = userInfo.resetPasswordExpires,
      currTime = (new Date()).getTime(),
      timeDiff = Math.ceil((Math.abs(currTime - expiresIn) / 1000) / 60);
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
        if(tokenExists){
            let isUpdated = await req.models.user.update({
            emailVerified : 1,
            verifyEmailToken:" "
          }, {
            where: {
              id:tokenExists.id
            }
          });
          return res.status(req.constants.HTTP_SUCCESS).json({ status: req.constants.SUCCESS, code: req.constants.HTTP_SUCCESS, message: "Your email has been successfully verified." })
        }else{
        return res.status(req.constants.HTTP_NOT_FOUND).json({ status: req.constants.ERROR, code: req.constants.HTTP_NOT_FOUND, message: "Your email verification link has expired." })
        }
    } catch (err) {
      logger.log('verifyEmailToken', req, error, 'user', 0);
      return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, code: req.constants.HTTP_SERVER_ERROR, message: req.messages.INTERNAL500 + err })
    }
  }

const userNameValidation = async(req,res) =>{
  try{
        let userName = req.query.userName;
        if(!userName) return res.status(req.constants.HTTP_SUCCESS).json({ status: req.constants.SUCCESS, code: req.constants.HTTP_SUCCESS, message: '' })

        let userNameExists = await req.models.user.findOne({ where: {userName}})
        if(!userNameExists) res.status(req.constants.HTTP_SUCCESS).json({ status: req.constants.SUCCESS, code: req.constants.HTTP_SUCCESS, message: req.messages.USER.USER_NAME_NOT_EXIST})
        else res.status(req.constants.HTTP_ALREADY_EXISTS).json({ status: req.constants.ERROR, code: req.constants.HTTP_ALREADY_EXISTS, message: req.messages.USER.USER_NAME_ALREADY_EXIST })
    } catch (err) {
    //logger.log('Change Password', req, err, 'user', verifyEmailToken);
      return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, code: req.constants.HTTP_SERVER_ERROR, message: req.messages.INTERNAL500 + err })
    }
  }
  
  
  
  const TestUserCreattion = async(req, res) => {   
    try {    
      let date = new Date();
      const crypto = require("crypto");
      let verifyEmailToken = crypto.createHash('sha256').digest('hex');
      let userData = {
      firstName:verifyEmailToken,
      lastName:"last",
      userName:verifyEmailToken,
      password: "$2a$10$DIGUM31FXT6qApfEOB558O.ZoF5L88oSMoQyNbHzAPQxh0Fi0onTu",
      email_verified:1,
      role: 3,
      admin:0,
      status:1,
      createdAt: date,
      updatedAt: date      
    };
        
    let newUserData = await req.models.user.create(userData);
    let user_id = newUserData.id;
    let bracketName = `${newUserData.userName}-male-bracket`; 
    let userBracketData = {
		user_id: user_id,
		name: bracketName,
		type: "male"
     };
      const createBreaket = await req.models.user_breaket.create(userBracketData);
      await insertUserBracketDetails(req, "male", createBreaket.id)
      
      return res.send({"status":"done"})         
    } catch (error) {
      logger.log('Create Admin', req, error, 'user', 0);
      res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + error });
    }
  };
  const insertUserBracketDetails =  async function insertUserBracketDetails(req, bracketType,userBracketId) {
    try{
         let sql = `select  tgs.game_id , tgs.team_1_id ,tgs.team_2_id,${userBracketId} as user_bracket_id
        from tournament_leagues tls inner join tournament_breakets tbs on tls.current_subseason_id = tbs.subseason_id inner join tournament_games tgs on 
          tgs.bracket_id = tbs.bracket_id left join tournament_teams tm1 on tm1.team_id=tgs.team_1_id left join tournament_teams tm2 on 
          tm2.team_id=tgs.team_2_id left join winner_brackt_relation wbr on wbr.bracket_id =tgs.bracket_id and wbr.round = tgs.round left join loser_brackt_relation lbr on lbr.bracket_id =tgs.bracket_id and lbr.round = tgs.round
           where tls.gender = "${bracketType}"`;
        const getQueryResult = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })
        await req.models.user_breaket_team.bulkCreate(getQueryResult);

        return getQueryResult
     }catch(err){
         console.log(err);
     }
 };
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
  verifyEmailToken,
  userNameValidation,
  TestUserCreattion
};
