// Middleware
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const commonHelper = require("../helper/common-helper");
const commondataController = require("../controllers/commonController");
const bracketManagerController = require("../controllers/bracketManager.js");
const userBreaketTeamController = require("../controllers/userBracketTeams");

const commonValidation = require("../validations/commonSchema");

const routes = require('express').Router();


routes.post("/tieBreakerResolver",auth.isAuthenticated,userBreaketTeamController.tieBreakerResolver);
routes.get("/commonData", commondataController.getCommonData);
routes.post("/contactUs", validate(commonValidation.contactUs), commondataController.contactUs);
routes.post("/sendInvite", auth.isAuthenticated, validate(commonValidation.inviteFriend), commondataController.inviteFriends);
routes.get('/getGameLists', bracketManagerController.getGameLists);
routes.post('/getUserGameLists', auth.isAuthenticated,bracketManagerController.getUserGameLists);

routes.get('/updateWinner', bracketManagerController.updateWinner);
routes.post('/updateMultiWinner', bracketManagerController.updateMultiWinner);

routes.get('/getGameListsByUserBracketID', bracketManagerController.getGameListsByUserBracketID);
routes.post('/updateTeamScore',auth.isAuthenticated, bracketManagerController.updateMultiWinnerByScore);

routes.get('/getInCompleteBracketUsers',auth.isAuthenticated, userBreaketTeamController.getInCompleteBracketUsers);





/*routes.get("/getEnv", (req, res)=>{

res.send({"env":process.env})

});
routes.get("/getConfig", (req, res)=>{

			const  fs = require('fs');
			let path =  require("path");
			let absolute_path = path.join(__dirname, "../config/");
			let absolutePathToImage = absolute_path+"config.json";
    		let filebuffer = fs.readFileSync(absolutePathToImage);


res.send({"filebuffer":JSON.parse(filebuffer)})

});
*/


routes.get("/s3test5", async (req, res)=>{
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
		return res.send({"Success":filenames, "s3Data":s3Data});
	} catch (err) {
	  res.send({"res":err})
	}
})





// routes.get("*", (req, res, next) => {
//     res.send("Un-authorized access");
// });


module.exports = routes;
