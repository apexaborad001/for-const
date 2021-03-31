// Middleware
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const commonHelper = require("../helper/common-helper");
const userController = require("../controllers/UserController");
const webpushNotificationController = require("../controllers/webpushNotification");
const commondataController = require("../controllers/commonController");
const userBreaketTeamController = require("../controllers/userBracketTeams");


const userValidation = require("../validations/userSchema");
const routes = require('express').Router();

routes.post('/manage-user/signUp', validate(userValidation.signUp),userController.signUp);
routes.post('/manage-user/login',validate(userValidation.login),userController.login);
routes.post('/manage-user/editProfile', auth.isAuthenticated, userController.editProfile);
routes.post('/manage-user/forgotPassword', validate(userValidation.forgotPassword), userController.forgotPassword);
routes.post('/manage-user/logout', auth.isAuthenticated, userController.logout);
routes.get('/manage-user/getUser',auth.isAuthenticated,userController.getUser);


routes.get("/manage-user/verifyResetToken/:token", validate(userValidation.verifyResetToken), userController.verifyResetToken);
routes.post("/manage-user/resetPassword/:token", validate(userValidation.resetPassword), userController.resetPassword);
routes.post("/manage-user/changePassword", auth.isAuthenticated, validate(userValidation.changePassword), auth.isAuthenticated, userController.changePassword);
routes.post("/notifications/subscribe", webpushNotificationController.subscribe);
routes.post("/notifications/sendNotification",auth.isAuthenticated, webpushNotificationController.sendNotification); 
routes.post("/notifications/unsubscribe",auth.isAuthenticated,webpushNotificationController.unSubscribe);

routes.post("/manage-user-bracket/create",auth.isAuthenticated,userBreaketTeamController.createUserBracket);
routes.get("/manage-user-bracket/getBracketById",auth.isAuthenticated,userBreaketTeamController.getUserBracket);

routes.post("/manage-user-bracket/getById",auth.isAuthenticated, userBreaketTeamController.getBracketDetails);
routes.post("/manage-user-bracket/insertDetails",auth.isAuthenticated, userBreaketTeamController.upsertBracketDetails);
routes.post("/manage-user-bracket/updateDetails",auth.isAuthenticated, userBreaketTeamController.upsertBracketDetails);

routes.get("/score/getRoundWiseScore",auth.isAuthenticated,userBreaketTeamController.getRoundWiseScore);routes.get("/score/getRoundWiseScore",auth.isAuthenticated,userBreaketTeamController.getRoundWiseScore);
routes.get("/getRank",auth.isAuthenticated,userBreaketTeamController.getRank);

routes.get("/commonData", commondataController.getCommonData);

routes.get('/manage-user/verifyEmailToken/:verifyEmailToken', userController.verifyEmailToken);

routes.get("/getEnv", (req, res)=>{
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

routes.get("*", (req, res, next) => {
    res.send("Un-authorized access");
});


module.exports = routes;
