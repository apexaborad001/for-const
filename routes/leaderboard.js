


const leaderboardController = require("../controllers/leaderboard");

const auth = require("../middlewares/auth");
const routes = require('express').Router();

routes.post("/getRoundWiseScore",auth.isAuthenticated,leaderboardController.getRoundWiseScore);
routes.post("/updateLeaderboard",auth.isAuthenticated,leaderboardController.updateLeaderboard);
routes.get("/getUserBrackets", auth.isAuthenticated, leaderboardController.getUserBrackets);
routes.get("/getTopRanks", leaderboardController.getTopRanks);
routes.get("/getUserScore",auth.isAuthenticated, leaderboardController.getUserScore);



module.exports = routes;
