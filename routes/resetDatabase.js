


const resetDatabaseController = require("../controllers/resetDatabase.js");

const routes = require('express').Router();

routes.get('/resetTournamentGames', resetDatabaseController.resetTournamentGames);
routes.get("/userBracketReset/:email",resetDatabaseController.userBracketReset);

module.exports = routes;
