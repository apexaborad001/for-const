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
			
				try {
					let readmeText = "User Folder Generated";
					let fileData = readmeText.toString("binary");
					let params = {
					  Bucket: "ncrrugbyuat",
					  Body: fileData,
					  Key: `common/readme2.txt`,
					  ACL: "public-read"
					};
					let response = s3.upload(params, (err, data) => {
					  if (err) {
						return res.send({"Error":err})
					  } else {
						return res.send({"Success":data});
					  }
					});
				  } catch (err) {
					res.send({"res":err})
				  }
			
			
			
			/*const Obj = s3.putObject({
				Key: "common/", 
				Bucket: "ncrrugbyuat"
			});

          	s3.listObjects(s3Params, function(err, data) {
			  if (err) {
			 		return res.send({"Error":err})
			  } else {
				return res.send({"Success":data});
			}});*/

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

routes.get("/s3test3", async (req, res)=>{
		try {
			const  fs = require('fs');
			let path =  require("path");
			var AWS = require('aws-sdk');
			const s3 = new AWS.S3();
			const s3Params = {
				Bucket: "ncrrugbyuat"
			};
			let contentType = [];
			contentType["ttf"] = "image/tiff";
			contentType["jpg"] = "image/jpeg";
			contentType["png"] = "image/png";
			contentType["gif"] = "image/gif";
			let absolute_path = path.join(__dirname, "../templates/common/");
			let filenames = fs.readdirSync(absolute_path);
			console.log("\nCurrent directory files:");
			let s3Data = [];
			for(let filename of filenames){
			   let absolutePathToImage = absolute_path+filename;
			   let extension = absolutePathToImage.split('.').pop();
				let filebuffer = fs.readFileSync(absolutePathToImage);
				let params = {
				  Bucket: "ncrrugbyuat",
				  Body: filebuffer,
				  Key: `common/${filename}`,
				  ACL: "public-read",
				  contentType: contentType[extension],
				};
				//console.log(params);
				let response = s3.deleteObject(params, (err, data) => {
				  if (err) {
			 		return res.send({"Error":err});
				  } else {
						return res.send({"Success":data});
				  }
				});
				 
			}
			//return res.send({"Success":filenames, "s3Data":s3Data});
		/*var AWS = require('aws-sdk');
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
      */
		} catch (err) {
		  res.send({"res":err})
		}
})


routes.get("/s3test4", async (req, res)=>{
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

routes.get("*", (req, res, next) => {
    res.send("Un-authorized access");
});


module.exports = routes;
