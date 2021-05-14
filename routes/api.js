// Middleware
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const commonHelper = require("../helper/common-helper");
const commondataController = require("../controllers/commonController");
const bracketManagerController = require("../controllers/bracketManager.js");
const userBreaketTeamController = require("../controllers/userBracketTeams");
const UserController = require("../controllers/UserController");
const commonValidation = require("../validations/commonSchema");
const cron = require('node-cron');
const cronm = require("../cron");
const routes = require('express').Router();
var task = "";
routes.get('/getLatestGames',auth.isAuthenticated, userBreaketTeamController.getLatestGames);
routes.post("/tieBreakerResolver",auth.isAuthenticated,userBreaketTeamController.tieBreakerResolver);
routes.get("/commonData", commondataController.getCommonData);
routes.post("/contactUs", validate(commonValidation.contactUs), commondataController.contactUs);
routes.post("/sendInvite", auth.isAuthenticated, validate(commonValidation.inviteFriend), commondataController.inviteFriends);
routes.get('/getGameLists', bracketManagerController.getGameLists);
routes.post('/updateTeamScore',auth.isAuthenticated, bracketManagerController.updateMultiWinnerByScore);
routes.post('/TestUserCreattion', UserController.TestUserCreattion);
const moment = require("moment");
routes.get("/starttime", async (req, res)=>{
     try{
     let sql6 = `select * from system_settings where type="submission_deadline"`;
     let cronData = await req.database.query(sql6, { type: req.database.QueryTypes.SELECT });
    let gameStarted = false;
    let date2 = new Date();
    let dateTime = moment(date2).format("YYYY-MM-DD HH:mm:ss");
    if (dateTime > cronData[0]["value"]) {
       gameStarted = true;
    }
    return res.send({"game_start_time1":cronData[0]["value"], gameStarted});
   }catch(err){
   	console.log("errotr", err);
   	return res.send({err});
   }
});

routes.get("/croninit", async (req, res)=>{
   try{
	   const token = "217177df38b750681dd444da52fe09f51239df1801eerf5ec0409e21204b6e9c1f1777770";
	   if(req.headers['access_token'] === token){
	        console.log(task);
	 	if(task) task.stop();
	 	 
		let reminder1_start = "2021-05-12 10:00:00";
		let reminder1_end = "2021-05-12 10:31:00";
		let reminder2_start = "2021-05-12 10:30:00";
		let reminder2_end = "2021-05-12 10:31:00";
		let remove_bracket_start = "2021-05-12 11:30:00";
		let remove_bracket_end = "2021-05-12 11:31:00";
		let date1_start = "2021-05-12 12:00:00";
		let date1_end = "2021-05-12 12:01:00";
		let date2_start = "2021-05-12 12:30:00";
		let date2_end = "2021-05-12 12:31:00";
		let date3_start = "2021-05-12 13:00:00";
		let date3_end = "2021-05-12 13:01:00";
		
                
                task = cron.schedule(' * * * * *', async () =>  {
  			//cronm.dailyCronAPI();
  		console.log("cron running", reminder1_end);	 			 
				let date2 = new Date();
				
				let dateTime = moment(date2).format("YYYY-MM-DD HH:mm:ss");
				console.log("cron running", dateTime);
		let sql = `select * from system_settings where type="cron"`;
	        let cronData = await req.database.query(sql, { type: req.database.QueryTypes.SELECT });
	         
	        for(let i in  cronData){
	           let row2 = cronData[i];
                    if(row2["name"] == "reminder1_start"){
                         reminder1_start = row2["value"];
                    }else if(row2["name"] == "reminder1_end"){
                         reminder1_end = row2["value"];
                         console.log("reminder1_end",reminder1_end);  
                    }else if(row2["name"] == "reminder2_start"){
                         reminder2_start = row2["value"];
                    }else if(row2["name"] == "reminder2_end"){
                         reminder2_end = row2["value"];
                    }else if(row2["name"] == "remove_bracket_start"){
                         remove_bracket_start = row2["value"];
                    }else if(row2["name"] == "remove_bracket_end"){
                         remove_bracket_end = row2["value"];
                    }else if(row2["name"] == "date1_start"){
                        date1_start = row2["value"];
                    }else if(row2["name"] == "date1_end"){
                        date1_end = row2["value"];
                    }else if(row2["name"] == "date2_start"){
                         date2_start = row2["value"];
                    }else if(row2["name"] == "date2_end"){
                         date2_end = row2["value"];
                    }else if(row2["name"] == "date3_start"){
                          date3_start = row2["value"];
                    }else if(row2["name"] == "date3_end"){
                          date3_end = row2["value"];
                    }
                             
                }

				if(dateTime > reminder1_start && dateTime < reminder1_end){
				    cronm.sendReminder("reminder_one");
				}
				if(dateTime > reminder2_start && dateTime < reminder2_end){
				      cronm.sendReminder("reminder_two");
				}				
				if(dateTime > remove_bracket_start && dateTime < remove_bracket_end){
				       cronm.deleteOldBracket("delete_bracket");
				}				
				if(dateTime > date1_start && dateTime < date1_end){
				       //ScoreCard("2021-05-09", "day1");
				       cronm.SendRecap("2021-05-09", "day1");
				}
				
				if(dateTime > date2_start && dateTime < date2_end){
				       //ScoreCard(date1_start, "day2");
					cronm.SendRecap(date1_start, "day2");
				}
				
				if(dateTime > date3_start && dateTime < date3_end){
				       cronm.SendRecap(date2_start, "day3");
				}
   
		});
         	
	   	return res.send({"status":"cron started"});
	   }else{
	        return res.send({"error":"invalid token"});
	   }
	   
    }catch(error){
       return res.send({"error":error});
    	
    }
})
routes.get("/currenttime", async (req, res)=>{
   const moment = require("moment");
   let date2 = new Date();
  return res.send({"current_time":date2});
});
routes.get("/s3test5", async (req, res)=>{
	try {
	    /*const moment = require("moment");
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
        */
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
		return res.send({"Success1":filenames, "s3Data":s3Data});
	} catch (err) {
	  res.send({"res":err})
	}
})

module.exports = routes;
