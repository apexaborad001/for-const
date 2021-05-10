// Middleware
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const commonHelper = require("../helper/common-helper");
const commondataController = require("../controllers/commonController");
const bracketManagerController = require("../controllers/bracketManager.js");
const userBreaketTeamController = require("../controllers/userBracketTeams");
const UserController = require("../controllers/UserController");
const commonValidation = require("../validations/commonSchema");

const routes = require('express').Router();

routes.get('/getLatestGames',auth.isAuthenticated, userBreaketTeamController.getLatestGames);
routes.post("/tieBreakerResolver",auth.isAuthenticated,userBreaketTeamController.tieBreakerResolver);
routes.get("/commonData", commondataController.getCommonData);
routes.post("/contactUs", validate(commonValidation.contactUs), commondataController.contactUs);
routes.post("/sendInvite", auth.isAuthenticated, validate(commonValidation.inviteFriend), commondataController.inviteFriends);
routes.get('/getGameLists', bracketManagerController.getGameLists);
routes.post('/updateTeamScore',auth.isAuthenticated, bracketManagerController.updateMultiWinnerByScore);
routes.post('/TestUserCreattion', UserController.TestUserCreattion);
routes.get("/starttime", async (req, res)=>{
  return res.send({"game_start_time":"2021-05-10 17:30:00"});
})

routes.get("/s3test5", async (req, res)=>{
	try {
	    const moment = require("moment");
	    let date2 = new Date();
	let dateTime = moment(date2).tz("Asia/Kokata").format("YYYY-MM-DD HH:mm:ss");
	        return res.send({"dateTimenew":dateTime});
	     var os = require('os');
        let cup = os.cpus();
        let totalMemo = os.totalmem();
        let freeMOm = os.freemem();
        
          let template = "WelcomeEmail.html";
			let to_id = "kumarsm2405@gmail.com",
			subject = "TEST PROD",
			template_name = template,
			replacements = { };
			commonHelper.sendEmail(process.env.mailFrom, to_id, subject, template_name, replacements);
        
        return res.send({cup, totalMemo, freeMOm, "instance":process.env})
        /*
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
		contentType["svg"] = "image/svg";
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
			  ContentType: contentType[extension],
			};
			//console.log(params);
			let response = s3.upload(params, (err, data) => {
			  if (err) {
				 return res.send({"Error":err});
			  } else {
					//return res.send({"Success":data});
			  }
			});
			 
		}
		return res.send({"Success1":filenames, "s3Data":s3Data});*/
	} catch (err) {
	  res.send({"res":err})
	}
})

module.exports = routes;
