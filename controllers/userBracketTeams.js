const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const helper = require('../helper/common-helper');
const logger = require('../helper/logger-helper');
const bcrypt = require('bcrypt-nodejs');
const userBracketTeams = require('../models/user_breakets');
const roundAndDifferentBracketJson = [{id:2, "bracketName": "Survivor Cup", round: 1 }, {id:3, "bracketName": "Champions Cup", round: 2 }, { id:4,"bracketName": "Challenge Cup", round: 1 }]
const { roundWiseScoreDetails, getRoundWiseDetailsInFormat } = require('../util')

const createUserBracket = async (req, res) => {
  try {
    let userId = req.decoded.user_id
    let bracketName = req.body.bracketName
    let bracket = await req.models.user_breaket.findOne({
      where: {
        user_id: userId,
      }
    });
    if (bracket) {
      logger.log(req.messages.USER_BRACKET.UNSUCCESSFULL, req, 'user_breaket', userId);
      res.status(req.constants.HTTP_ALREADY_EXISTS).json({
        status: req.constants.ERROR,
        code: req.constants.HTTP_ALREADY_EXISTS,
        message: req.messages.USER_BRACKET.UNSUCCESSFULL,
        data: null
      });
    }
    else {
      let userBracketData = {
        user_id: userId,
        name: bracketName
      };
      const createBreaket = await req.models.user_breaket.create(userBracketData);
      res.status(req.constants.HTTP_SUCCESS).json({
        status: req.constants.SUCCESS,
        code: req.constants.HTTP_SUCCESS,
        message: req.messages.USER_BRACKET.SUCCESS,
        data: createBreaket
      });
    }
  }
  catch (error) {
    logger.log('User bracket', req, error, 'user_breaket', req.decoded.user_id);
    res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + error });
  }
};

const getRoundWiseScore = async (req, res) => {
  try {
    let userId = req.decoded.user_id
    const sql = `SELECT round,user_bracket_id,sum(winner_score) as score FROM user_breaket_teams left JOIN tournament_games ON user_breaket_teams.game_id=tournament_games.game_id and user_breaket_teams.team_id=tournament_games.winner_id  left JOIN user_breakets on user_breaket_teams.user_bracket_id= user_breakets.id where user_breakets.user_id='` + userId + `' GROUP BY round,user_id,user_bracket_id order by user_bracket_id,round;`
    const roundWiseQueryResult = await req.database.query(sql,  { type: req.database.QueryTypes.SELECT })
    const mainBracketScore = await getRoundWiseDetailsInFormat(roundWiseQueryResult)
    const roundWiseScoreObject = {};
    roundWiseScoreObject['Main Bracket'] = mainBracketScore;

    for (const roundAndBracket of roundAndDifferentBracketJson) {
      const round = roundAndBracket.round;
      const bracketName = roundAndBracket.bracketName;
      const bracketId = roundAndBracket.id;
      let roundWiseScore = await roundWiseScoreDetails(req, "looser_id", round, bracketName, bracketId, userId);
      roundWiseScoreObject[bracketName] = roundWiseScore
    }
    logger.log('getRoundWiseScore', req, '', 'user_breaket_team', req.decoded.user_id);
    res.status(req.constants.HTTP_SUCCESS).json({
      code: req.constants.HTTP_SUCCESS,
      status: req.constants.SUCCESS,
      message: req.messages.SCORE.SUCCESS,
      data: roundWiseScoreObject,
    })
  }
  catch (err) {
    logger.log('getRoundWiseScore', req, err, 'user_breaket_team', req.decoded.user_id);
    res.status(req.constants.HTTP_SERVER_ERROR).json({
      status: req.constants.ERROR,
      code: req.constants.HTTP_SERVER_ERROR,
      message: req.messages.INTERNAL500 + err
    })
  }
};


const getRank = async (req, res) => {
  try {
    const sql = `SELECT user_id,sum(winner_score) as score FROM user_breaket_teams left JOIN tournament_games ON user_breaket_teams.game_id=tournament_games.game_id and user_breaket_teams.team_id=tournament_games.winner_id left JOIN user_breakets on user_breaket_teams.user_bracket_id= user_breakets.id GROUP BY user_id order by score desc;`
    const userWiseMainBracketScore = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })
    
    let userWiseAllBracketScore=[];
    let allUserBrackets = await req.database.query(`select * from user_breakets`, { type: req.database.QueryTypes.SELECT })

    for (const userBracket of allUserBrackets) {
      let userBracketScore = 0;
      const userIdd = userBracket.user_id;

      const sqlQuery = `SELECT sum(winner_score) as score FROM tournament_games inner join tournament_breakets on tournament_games.bracket_id=tournament_breakets.bracket_id inner join tournament_leagues on tournament_breakets.subseason_id=tournament_leagues.current_subseason_id where tournament_leagues.name in ("Survivor Cup","Challenge Cup","Champions Cup") and winner_id IN (SELECT team_id FROM user_breaket_teams INNER JOIN tournament_games ON user_breaket_teams.game_id=tournament_games.game_id and user_breaket_teams.team_id=tournament_games.looser_id inner join user_breakets on user_breakets.id = user_breaket_teams.user_bracket_id where tournament_games.round in (1,2) and user_id= ${userIdd})`
      let bracketWiseScore = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT })
      userBracketScore = userBracketScore +( bracketWiseScore && bracketWiseScore.length ? parseInt(bracketWiseScore[0].score) : 0);
      
      const mainBracketScore = userWiseMainBracketScore.filter(ele=>ele.user_id ==userIdd && ele.score)
      userBracketScore = userBracketScore+ (mainBracketScore && mainBracketScore.length ? parseInt(mainBracketScore[0].score) :0)
      userWiseAllBracketScore.push({ user_id: userIdd, score: userBracketScore })
    }
    res.status(req.constants.HTTP_SUCCESS).json({
      code: req.constants.HTTP_SUCCESS,
      status: req.constants.SUCCESS,
      message: req.messages.RANK.SUCCESS,
      data: userWiseAllBracketScore,
    })
  }
  catch (err) {
    logger.log('Score', req, err, 'user_breaket_team', req.decoded.user_id);
    res.status(req.constants.HTTP_SERVER_ERROR).json({
      status: req.constants.ERROR,
      code: req.constants.HTTP_SERVER_ERROR,
      message: req.messages.INTERNAL500 + err
    })
  }
};

const getUserBracket = async (req, res) => {
  try {
    let userId = req.decoded.user_id
    let bracket = await req.models.user_breaket.findAll({
      where: {
        user_id: userId
      }
    });
    if (bracket) {
      res.status(req.constants.HTTP_SUCCESS).json({
        status: req.constants.SUCCESS,
        code: req.constants.HTTP_SUCCESS,
        message: req.messages.USER_BRACKET.FOUND,
        data: bracket
      });
    }
    else {
      logger.log(req.messages.USER_BRACKET.NOTFOUND, req, 'user_breaket', userId);
      res.status(req.constants.HTTP_NOT_FOUND).json({
        status: req.constants.SUCCESS,
        code: req.constants.HTTP_NOT_FOUND,
        message: req.messages.USER_BRACKET.NOTFOUND,
        data: null
      });
    }
  }
  catch (error) {
    logger.log('User bracket', req, error, 'user_breaket', req.decoded.user_id);
    res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + error });
  }
};

const getBracketDetails = async (req, res) => {
  try {
    let userBracketId = req.body.userBracketId
    let findUserBrackets = await req.models.user_breaket_team.findAll({
      where: {
        user_bracket_id: userBracketId
      },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
    if (findUserBrackets && findUserBrackets.length) {
      res.status(req.constants.HTTP_SUCCESS).json({
        code: req.constants.HTTP_SUCCESS,
        status: req.constants.SUCCESS,
        message: req.messages.USER_BRACKET_TEAMS.FOUND,
        data: findUserBrackets,
      })
    }
    else {
      res.status(req.constants.HTTP_SUCCESS).json({
        code: req.constants.HTTP_SUCCESS,
        status: req.constants.SUCCESS,
        message: req.messages.USER_BRACKET_TEAMS.NOTFOUND,
        data: findUserBrackets,
      })
    }
  } catch (err) { //console.log(err);
    logger.log('User bracket', req, err, 'user_breaket_team', req.decoded.user_id);
    res.status(req.constants.HTTP_SERVER_ERROR).json({
      status: req.constants.ERROR,
      code: req.constants.HTTP_SERVER_ERROR,
      message: req.messages.INTERNAL500 + err
    })
  }
}

const upsertBracketDetails = async (req, res) => {
  try {
    let userBracketId = req.body.userBracketId
    req.models.user_breaket_team.destroy({
      where: {
        user_bracket_id: userBracketId
      }
    });
    const userBracketDetials = req.body.userBracketDetails;
    const mappedUserBracketDetais = userBracketDetials.map(ele => {
      return {
        user_bracket_id: userBracketId,
        team_id: ele.teamId,
        game_id: ele.gameId
      }
    })
    const upsertBracket = await req.models.user_breaket_team.bulkCreate(mappedUserBracketDetais);
    res.status(req.constants.HTTP_SUCCESS).json({ status: req.constants.SUCCESS, code: req.constants.HTTP_SUCCESS, message: req.messages.USER_BRACKET_TEAMS.UPSERT, data: upsertBracket });

  }
  catch (error) {
    logger.log('Upsert Bracket', req, error, 'user_breaket_team', req.decoded.user_id);
    res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + error });
  }
};

module.exports = {
  getBracketDetails,
  getUserBracket,
  upsertBracketDetails,
  createUserBracket,
  getRoundWiseScore,
  getRank
}