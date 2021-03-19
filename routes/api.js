// Middleware
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const commonHelper = require("../helper/common-helper");
const userController = require("../controllers/UserController");
const userValidation = require("../validations/userSchema");
const routes = require('express').Router();

routes.post('/manage-user/signUp', validate(userValidation.signUp),userController.signUp);
routes.post('/manage-user/login',validate(userValidation.login),userController.login);
routes.post('/manage-user/editProfile', auth.isAuthenticated, userController.editProfile);
routes.post('/manage-user/forgotPassword', validate(userValidation.forgotPassword), userController.forgotPassword);
routes.post('/manage-user/logout', auth.isAuthenticated, userController.logout);
routes.get('/manage-user/getUser',auth.isAuthenticated,userController.getUser);

routes.get("/s3test", async (req, res)=>{
		try {
			var AWS = require('aws-sdk');
			const s3 = new AWS.S3();
			const s3Params = {
				Bucket: "ncrrugbyuat"
			};
          	s3.listObjects(s3Params, function(err, data) {
			  if (err) {
			 		return res.send({"Error":err})
			  } else {
				return res.send({"Success":data});
			}});

		} catch (err) {
		  res.send({"res":err})
		}
})
routes.get("/s3test2", async (req, res)=>{
		try {
			var AWS = require('aws-sdk');
			const s3 = new AWS.S3();
		    return res.send({s3:s3})

		} catch (err) {
		  res.send({"res":err})
		}
})
routes.get("*", (req, res, next) => {
    res.send("Un-authorized access");
});


module.exports = routes;
