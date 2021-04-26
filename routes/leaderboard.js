


const leaderboardController = require("../controllers/leaderboard");

const auth = require("../middlewares/auth");
const routes = require('express').Router();

routes.post("/getRoundWiseScore",auth.isAuthenticated,leaderboardController.getRoundWiseScore);
routes.post("/getRank",auth.isAuthenticated,leaderboardController.getRank);
routes.post("/updateLeaderboard",auth.isAuthenticated,leaderboardController.updateLeaderboard);
routes.post("/getUserRank",auth.isAuthenticated, leaderboardController.getUserRank);
routes.get("/getUserScore",auth.isAuthenticated, leaderboardController.getUserScore);



module.exports = routes;
