const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const helper = require('../helper/common-helper');
const logger = require('../helper/logger-helper');
const bcrypt = require('bcrypt-nodejs');
const userBracketTeams = require('../models/user_breakets');
const roundArray = [1, 2, 3, 4, 5, 6]

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
    const roundWiseQueryResult = await req.database.query(sql, {
      raw: true,
      model: userBracketTeams,
      mapToModel: false
    })
    console.log(roundWiseQueryResult)
    let scoreRoundFinalArray = [];
    let lastRoundBracketId;
    let roundCounter = 0;
    let differentBracketFlag= false;
    for (let i = 0; i < roundWiseQueryResult.length; i++) {
      let ele = roundWiseQueryResult[i];
      let roundEle = ele;
      differentBracketFlag = false;
      roundCounter++;
      if (!lastRoundBracketId) lastRoundBracketId = ele.user_bracket_id;
      if(lastRoundBracketId != ele.user_bracket_id){
        differentBracketFlag = true;
        if (roundCounter < roundArray.length) {
          for (let i = roundCounter; i < roundArray.length; i++) {
            if (i !== ele.round) roundEle = { round: i, user_bracket_id: lastRoundBracketId, score: 0 }
            else roundEle = ele;
            scoreRoundFinalArray.push(roundEle)
          }
        }
        roundCounter = 0;
      }
      roundEle = ele;
      if (!(ele.round && ele.score) || (i === (roundWiseQueryResult.length-1))) {
        lastRoundBracketId = null;
        if (roundCounter < roundArray.length) {
          for (let i = roundCounter; i < roundArray.length; i++) {
            if (i !== ele.round) roundEle = { round: i, user_bracket_id: ele.user_bracket_id, score: 0 }
            else roundEle = ele;
            scoreRoundFinalArray.push(roundEle)
          }
        }
        roundCounter = 0;
      }
      else {
        if(differentBracketFlag)roundCounter++; 
        if (roundCounter !== ele.round) {
          if (roundCounter < ele.round) {
            let roundEle1;
            for (let i = roundCounter; i < ele.round; i++) {
              roundCounter++;
              roundEle1 = { round: i, user_bracket_id: ele.user_bracket_id, score: 0 }
              scoreRoundFinalArray.push(roundEle1)
            }
          }
        }
        scoreRoundFinalArray.push(roundEle)
        lastRoundBracketId = ele.user_bracket_id;
      }
    }
    res.status(req.constants.HTTP_SUCCESS).json({
      code: req.constants.HTTP_SUCCESS,
      status: req.constants.SUCCESS,
      message: req.messages.SCORE.SUCCESS,
      data: scoreRoundFinalArray,
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

const getRank = async (req, res) => {
  try {
    const sql = `SELECT user_id,sum(winner_score) as score FROM user_breaket_teams left JOIN tournament_games ON user_breaket_teams.game_id=tournament_games.game_id and user_breaket_teams.team_id=tournament_games.winner_id left JOIN user_breakets on user_breaket_teams.user_bracket_id= user_breakets.id GROUP BY user_id order by score desc;`
    const getRankQueryResult = await req.database.query(sql, {
      raw: true,
      model: userBracketTeams,
      mapToModel: false
    })
    let rank = [];
    getRankQueryResult.forEach(ele => {
      console.log(ele)
      if (!ele.score) {
        ele = { user_id: ele.user_id, user_bracket_id: ele.user_bracket_id, score: 0 }
      }
      rank.push(ele)
    })
    res.status(req.constants.HTTP_SUCCESS).json({
      code: req.constants.HTTP_SUCCESS,
      status: req.constants.SUCCESS,
      message: req.messages.RANK.SUCCESS,
      data: rank,
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