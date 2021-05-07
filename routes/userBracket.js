


const auth = require("../middlewares/auth");
const routes = require('express').Router();
const userBreaketTeamController = require("../controllers/userBracketTeams");
routes.post("/updateDetails",auth.isAuthenticated, userBreaketTeamController.upsertBracketDetails);
routes.post("/create",auth.isAuthenticated,userBreaketTeamController.createUserBracket);
routes.get("/bracketDetails/:bracketType",auth.isAuthenticated, userBreaketTeamController.getUserBracketDetails);


module.exports = routes;
