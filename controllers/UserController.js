const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const helper = require('../helper/common-helper');
const logger = require('../helper/logger-helper');
const bcrypt = require('bcrypt');
const moment = require('moment');
const editProfile = async(req,res) =>{  
        try{
            const user_id = req.decoded.user_id;
            let userData = await req.models.user.findOne({attributes:{exclude:["password"]}, where:{id:user_id}});
            let keyToUpdate = ["fullName", "gender", "phoneNumber", "email"];
            for(let key of keyToUpdate){ 
            	if(req.body[key]) userData[key] = req.body[key]
            }
            await userData.save();
            let data = userData;
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
            return res.status(req.constants.HTTP_SUCCESS).json({ 
                status: req.constants.SUCCESS, 
                code: req.constants.HTTP_SUCCESS,
                data: data, 
                message: "Your profile has been successfully updated "
            });
        }catch(err){
            console.log(err)
           return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + error });
  
        }
        
    };


const signUp = async(req, res) => {   
    try {    
        let email = req.body.email,
        password = bcrypt.hashSync(req.body.password, 10);
        let findUser = await req.models.user.findOne({
          where: {
            userName: req.body.userName
          }
        });
        if (findUser) {
          return res.status(req.constants.HTTP_ALREADY_EXISTS).json({ status: req.constants.ERROR, code: req.constants.HTTP_ALREADY_EXISTS, message: req.messages.SIGNUP.ALREADY_EXISTS });
        } else {
          let userData = {
				password: password,
				email: email,
				userName: req.body.userName,
				fullName: req.body.fullName,
				phoneNumber: req.body.phoneNumber,
				countryCode: req.body.countryCode,
				gender: req.body.gender,
				otp_verified:1,
				email_verified:1,
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
	  	  return res.status(req.constants.HTTP_SUCCESS).json({ status: req.constants.SUCCESS, code: req.constants.HTTP_SUCCESS, message: req.messages.SIGNUP.SUCCESS});  
         }               
    } catch (error) {
      logger.log('Create Admin', req, error, 'user', req.decoded.user_id);
      res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + error });
    }
  };
  
    
  const login =  async(req, res) => { 
    let userName = req.body.userName;
    let password = req.body.password;
    try {
        var response = await req.models.user.findOne({
        	where: { userName: userName, isDeleted : 0 },
      	});
      	response = JSON.parse(JSON.stringify(response, null, 4));
      	if(response){
        let otp_verified = response.otpVerified;
        let comparedPassword = await bcrypt.compare(password, response.password);
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
  
  const forgotPassword =  async(req, res) => {
    let userName = req.body.userName;
    let oldPassword = req.body.oldPassword;
    let password = bcrypt.hashSync(req.body.password, 10);
    try {
        const foundUser = await req.models.user.findOne({
        	where: { userName: userName, isDeleted : 0 },
      	});
      	let response = JSON.parse(JSON.stringify(foundUser, null, 4));
      	if(response){
		    let comparedPassword = await bcrypt.compare(oldPassword, response.password);
		    if (comparedPassword) {
		            foundUser["password"] = password;
				    let isUpdate = await foundUser.save();
				    if(isUpdate){
				    	return res.status(req.constants.HTTP_SUCCESS).send({
							code: req.constants.HTTP_SUCCESS,
							status: req.constants.SUCCESS,
							message: req.messages.FORGOT_PASSWORD.SUCCESS
						}) 	
				    }else{
						return res.status(req.constants.HTTP_NOT_EXISTS).json({
							status: req.constants.ERROR,
							code: req.constants.HTTP_NOT_EXISTS,
							message: req.messages.FORGOT_PASSWORD.FAILURE
						});
				    }
				
		    } else {
		      logger.log('Forgot Password', req, {
		        status: req.constants.ERROR,
		        code: req.constants.HTTP_NOT_EXISTS,
		        message: req.messages.LOGIN.FAILURE
		      }, 'guest', 0);
			  return res.status(req.constants.HTTP_NOT_EXISTS).json({
				 status: req.constants.ERROR,
				 code: req.constants.HTTP_NOT_EXISTS,
				 message: req.messages.FORGOT_PASSWORD.FAILURE
			   });
		    }
      } else {
        logger.log('Forgot Password', req, {
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
      logger.log('Forgot Password', req, err, 'guest', 0);
      res.status(req.constants.HTTP_SERVER_ERROR).json({
        status: req.constants.ERROR,
        code: req.constants.HTTP_SERVER_ERROR,
        message: req.messages.INTERNAL500 + err
      })
    }
  }
  
   logout = async function(req, res) {
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

  },
 
  
module.exports = {
login,
signUp, 
editProfile,
logout,
forgotPassword
};
