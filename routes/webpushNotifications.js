


const webpushNotificationController = require("../controllers/webpushNotification");
const auth = require("../middlewares/auth");
const routes = require('express').Router();

routes.post("/unsubscribe",auth.isAuthenticated,webpushNotificationController.unSubscribe);
routes.post("/subscribe", auth.isAuthenticated, webpushNotificationController.subscribe);
routes.post("/sendNotification",auth.isAuthenticated, webpushNotificationController.sendNotification); 

module.exports = routes;
