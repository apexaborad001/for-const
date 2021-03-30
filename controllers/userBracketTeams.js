const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const helper = require('../helper/common-helper');
const logger = require('../helper/logger-helper');
const bcrypt = require('bcrypt-nodejs');
const userBracketTeams = require('../models/user_breakets');

const createUserBracket = async (req, res) => {
  try {
    let userId = req.decoded.user_id
    let bracketName = req.body.bracketName
    let bracket = await req.models.user_breaket.findOne({
      where: {
        user_id: userId,
        name: bracketName
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
    const sql = `SELECT round,user_bracket_id,sum(winner_score) as score FROM user_breaket_teams left JOIN tournament_games ON user_breaket_teams.game_id=tournament_games.game_id and user_breaket_teams.team_id=tournament_games.winner_id  left JOIN user_breakets on user_breaket_teams.user_bracket_id= user_breakets.id where user_breakets.user_id='` + userId + `' GROUP BY round,user_id,user_bracket_id;`
    const test = await req.database.query(sql, {
      raw: true,
      model: userBracketTeams,
      mapToModel: false
    })

    let scoreround = [];
    scoreround.push(test)
    if (test.round == null && test.score == null) {
      for (i = test.length + 1; i <= 5; i++) {
        let obj = { round: i, score: 0, user_bracket_id: test[0].user_bracket_id }
        console.log(obj)
        scoreround.push(obj)
      }
    }


    res.status(req.constants.HTTP_SUCCESS).json({
      code: req.constants.HTTP_SUCCESS,
      status: req.constants.SUCCESS,
      message: req.messages.SCORE.SUCCESS,
      data: scoreround,
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
  getRoundWiseScore
}