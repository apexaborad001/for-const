



const userValidation = require("../validations/userSchema");
const userController = require("../controllers/UserController");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const routes = require('express').Router();

routes.post('/signUp', validate(userValidation.signUp),userController.signUp);
routes.post('/login',validate(userValidation.login),userController.login);
routes.post('/editProfile', validate(userValidation.editProfile), auth.isAuthenticated, userController.editProfile);
routes.post('/forgotPassword', validate(userValidation.forgotPassword), userController.forgotPassword);
routes.post('/logout', auth.isAuthenticated, userController.logout);
routes.get('/getUser',auth.isAuthenticated,userController.getUser);
routes.get("/verifyResetToken/:token", validate(userValidation.verifyResetToken), userController.verifyResetToken);
routes.post("/resetPassword/:token", validate(userValidation.resetPassword), userController.resetPassword);
routes.post("/changePassword", auth.isAuthenticated, validate(userValidation.changePassword), auth.isAuthenticated, userController.changePassword);
routes.get('/verifyEmailToken/:verifyEmailToken', userController.verifyEmailToken);
routes.get('/validateUserName', userController.userNameValidation);

module.exports = routes;
