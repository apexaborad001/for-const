const { indexOf, forEach } = require('lodash');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const logger = require('../helper/logger-helper');
// const userBracketTeams = require('../models/user_breakets');
// const roundAndDifferentBracketJson = [{ id: 2, "bracketName": "Survivor Cup", round: 1 }, { id: 3, "bracketName": "Champions Cup", round: 2 }, { id: 4, "bracketName": "Challenge Cup", round: 1 }]
const { roundWiseScoreDetails, getRoundWiseDetailsInFormat } = require('../util')
const util =require('../util')
const topLeaderboardUser = 10;
const MENSBRACKET = "male";
const WOMENSBRACKET = "female";
const createUserBracket = async (req, res) => {
  try {
    let userId = req.decoded.user_id
    let bracketName = req.body.bracketName
    let bracketType = req.body.bracketType
    let bracket = await req.models.user_breaket.findOne({
      where: {
        user_id: userId,
        type:bracketType
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
        name: bracketName,
        type:bracketType
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
    let userId = req.decoded.user_id;
    const bracketId = req.body.user_bracket_id;
    const sqlQuery = `select round ,tls.name,sum(winner_score ) as score ,user_bracket_id  from user_breaket_teams ubt inner join (select group_concat(game_id) as gameids from tournament_games where bracket_id in (1,2,3,4,5,15,16,17,18,19) and round=1) as gidt inner join (select group_concat(game_id) as gameids from tournament_games where bracket_id in (1,2,3,4,5,15,16,17,18,19) and round=2) as gidt2 inner join tournament_games tgs on (tgs.game_id=ubt.game_id and ubt.team_id= tgs.winner_id) or (ubt.team_id= tgs.winner_id and tgs.bracket_id not in (1,2,3,4,5,15,16,17,18,19,12,13,14,26,27,28) and FIND_IN_SET(ubt.game_id, gidt.gameids)) or (ubt.team_id= tgs.winner_id and tgs.bracket_id in (12,13,14,26,27,28) and FIND_IN_SET(ubt.game_id, gidt2.gameids)) inner join tournament_breakets tbs on tgs.bracket_id=tbs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id  inner join user_breakets ubs on ubs.id = ubt.user_bracket_id and ubs.type = tls.gender inner join users on users.id=ubs.user_id where users.id =${userId} and  user_bracket_id=${bracketId} group by user_bracket_id,users.id,users.userName ,round,tls.name` 
    const roundWiseQueryResult = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT })
    // const sql = `SELECT round,user_bracket_id,sum(winner_score) as score FROM user_breaket_teams left JOIN tournament_games ON user_breaket_teams.game_id=tournament_games.game_id and user_breaket_teams.team_id=tournament_games.winner_id  left JOIN user_breakets on user_breaket_teams.user_bracket_id= user_breakets.id where user_breakets.user_id='` + userId + `' GROUP BY round,user_id,user_bracket_id order by user_bracket_id,round;`
    // const roundWiseQueryResult = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })
    // const mainBracketScore = await getRoundWiseDetailsInFormat(roundWiseQueryResult)
    // const roundWiseScoreObject = {};
    // roundWiseScoreObject['Main Bracket'] = mainBracketScore;

    // for (const roundAndBracket of roundAndDifferentBracketJson) {
    //   const round = roundAndBracket.round;
    //   const bracketName = roundAndBracket.bracketName;
    //   const bracketId = roundAndBracket.id;
    //   let roundWiseScore = await roundWiseScoreDetails(req, "looser_id", round, bracketName, bracketId, userId);
    //   roundWiseScoreObject[bracketName] = roundWiseScore
    // }
    const roundWiseScoreObject = await getRoundWiseDetailsInFormat(roundWiseQueryResult,bracketId)
    logger.log('getRoundWiseScore', req, '', 'user_breaket_team', userId);
    res.status(req.constants.HTTP_SUCCESS).json({
      code: req.constants.HTTP_SUCCESS,
      status: req.constants.SUCCESS,
      message: req.messages.SCORE.SUCCESS,
      data: roundWiseScoreObject,
    })
  }
  catch (err) {
    logger.log('getRoundWiseScore', req, err, 'user_breaket_team', userId);
    res.status(req.constants.HTTP_SERVER_ERROR).json({
      status: req.constants.ERROR,
      code: req.constants.HTTP_SERVER_ERROR,
      message: req.messages.INTERNAL500 + err
    })
  }
};

// const getRank = async (req, res) => {
//   try {
//     const sql = `SELECT user_id,sum(winner_score) as score FROM user_breaket_teams left JOIN tournament_games ON user_breaket_teams.game_id=tournament_games.game_id and user_breaket_teams.team_id=tournament_games.winner_id left JOIN user_breakets on user_breaket_teams.user_bracket_id= user_breakets.id GROUP BY user_id order by score desc;`
//     const userWiseMainBracketScore = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })

//     let userWiseAllBracketScore = [];
//     let allUserBrackets = await req.database.query(`select * from user_breakets`, { type: req.database.QueryTypes.SELECT })

//     for (const userBracket of allUserBrackets) {
//       let userBracketScore = 0;
//       const userIdd = userBracket.user_id;
//       //   for (const roundAndBracket of roundAndDifferentBracketJson) {
//       //     const round = roundAndBracket.round;
//       //     const bracketName = roundAndBracket.bracketName;
//       //     const sqlQuery = `SELECT sum(winner_score) as score FROM ncrrugby.tournament_games inner join tournament_breakets on tournament_games.bracket_id=tournament_breakets.bracket_id inner join tournament_leagues on tournament_breakets.subseason_id=tournament_leagues.current_subseason_id where tournament_leagues.name="${bracketName}" and winner_id IN (SELECT team_id FROM ncrrugby.user_breaket_teams INNER JOIN ncrrugby.tournament_games ON ncrrugby.user_breaket_teams.game_id=ncrrugby.tournament_games.game_id and ncrrugby.user_breaket_teams.team_id=ncrrugby.tournament_games.looser_id inner join user_breakets on user_breakets.id = user_breaket_teams.user_bracket_id where tournament_games.round=${round} and user_id=${userIdd}) `
//       //     let bracketWiseScore = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT })
//       //     userBracketScore = userBracketScore +( bracketWiseScore && bracketWiseScore.length ? parseInt(bracketWiseScore[0].score) : 0);
//       //   } 
//       const sqlQuery = `SELECT sum(winner_score) as score FROM ncrrugby.tournament_games inner join tournament_breakets on tournament_games.bracket_id=tournament_breakets.bracket_id inner join tournament_leagues on tournament_breakets.subseason_id=tournament_leagues.current_subseason_id where tournament_leagues.name in ("Survivor Cup","Challenge Cup","Champions Cup") and winner_id IN (SELECT team_id FROM ncrrugby.user_breaket_teams INNER JOIN ncrrugby.tournament_games ON ncrrugby.user_breaket_teams.game_id=ncrrugby.tournament_games.game_id and ncrrugby.user_breaket_teams.team_id=ncrrugby.tournament_games.looser_id inner join user_breakets on user_breakets.id = user_breaket_teams.user_bracket_id where tournament_games.round in (1,2) and user_id= ${userIdd})`
//       let bracketWiseScore = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT })
//       userBracketScore = userBracketScore + (bracketWiseScore && bracketWiseScore.length ? parseInt(bracketWiseScore[0].score) : 0);
//       const mainBracketScore = userWiseMainBracketScore.filter(ele => ele.user_id == userIdd && ele.score)
//       userBracketScore = userBracketScore + (mainBracketScore && mainBracketScore.length ? parseInt(mainBracketScore[0].score) : 0)
//       userWiseAllBracketScore.push({ user_id: userIdd, score: userBracketScore })
//     }
//     res.status(req.constants.HTTP_SUCCESS).json({
//       code: req.constants.HTTP_SUCCESS,
//       status: req.constants.SUCCESS,
//       message: req.messages.RANK.SUCCESS,
//       data: userWiseAllBracketScore,
//     })
//   }
//   catch (err) {
//     logger.log('Score', req, err, 'user_breaket_team', req.decoded.user_id);
//     res.status(req.constants.HTTP_SERVER_ERROR).json({
//       status: req.constants.ERROR,
//       code: req.constants.HTTP_SERVER_ERROR,
//       message: req.messages.INTERNAL500 + err
//     })
//   }
// };



const tieBreakerResolver=async(req,res)=>{
try{
  let userBracketId1=req.body.user_BracketId1
  let userBracketId2=req.body.user_BracketId2
  const tieBreakerResolverResult = await util.tieBreakerResolverFunction(req,userBracketId1,userBracketId2)
  res.status(req.constants.HTTP_SUCCESS).json({
    code: req.constants.HTTP_SUCCESS,
    status: req.constants.SUCCESS,
    message: req.messages.TIEBREAKER.SUCCESS,
    data: tieBreakerResolverResult,
  })
}catch(err)
{
  logger.log('getRoundWiseScore', req, err, 'user_breaket_team', userId);
  res.status(req.constants.HTTP_SERVER_ERROR).json({
    status: req.constants.ERROR,
    code: req.constants.HTTP_SERVER_ERROR,
    message: req.messages.INTERNAL500 + err
})
}
}


const getRank = async (req, res) => {
  try {
    const userBracketId = req.body.user_bracket_id;
    const sql = `SELECT userId,score,userName from leaderboards inner join user_breakets on user_breakets.type = leaderboards.bracketType where user_breakets.id = ${userBracketId}`
    const leaderboardData = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })
    res.status(req.constants.HTTP_SUCCESS).json({
      code: req.constants.HTTP_SUCCESS,
      status: req.constants.SUCCESS,
      message: req.messages.RANK.SUCCESS,
      data: leaderboardData,
    })
  }
  catch (err) {
    logger.log('getRank', req, err, 'user_breaket_team', 0);
    res.status(req.constants.HTTP_SERVER_ERROR).json({
      status: req.constants.ERROR,
      code: req.constants.HTTP_SERVER_ERROR,
      message: req.messages.INTERNAL500 + err
    })
  }
};

const getUserRankFunction= async (req,bracketType)=>{
  let sqlQuery = `select sum(winner_score ) as score,users.id as userId,users.userName ,"${bracketType}" as bracketType ,user_bracket_id  from user_breaket_teams ubt inner join (select group_concat(game_id) as gameids from tournament_games where bracket_id in (1,2,3,4,5,15,16,17,18,19) and round=1) as gidt inner join (select group_concat(game_id) as gameids from tournament_games where bracket_id in (1,2,3,4,5,15,16,17,18,19) and round=2) as gidt2 inner join tournament_games tgs on (tgs.game_id=ubt.game_id and ubt.team_id= tgs.winner_id) or (ubt.team_id= tgs.winner_id and tgs.bracket_id not in (1,2,3,4,5,15,16,17,18,19,12,13,14,26,27,28) and FIND_IN_SET(ubt.game_id, gidt.gameids)) or (ubt.team_id= tgs.winner_id and tgs.bracket_id in (12,13,14,26,27,28) and FIND_IN_SET(ubt.game_id, gidt2.gameids)) inner join tournament_breakets tbs on tgs.bracket_id=tbs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id  inner join user_breakets ubs on ubs.id = ubt.user_bracket_id  inner join users on users.id=ubs.user_id  where tls.gender = "${bracketType}" group by user_bracket_id,users.id,users.userName  order by score desc `;
  const userRank= await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT });
  return userRank;
};

const getUserRank = async (req,res) => {
  try {
    var index = -1;
    let userid = req.decoded.user_id;
    const bracketType = req.body.bracket_type;
    const userRank = await getUserRankFunction(req,bracketType)
    userRank.find(function(item, i){
      if(item.userId === userid){
        index = i;
        return i;
      }
    })
    res.status(req.constants.HTTP_SUCCESS).json({
      code: req.constants.HTTP_SUCCESS,
      status: req.constants.SUCCESS,
      message: req.messages.RANK.USERRANK,
      data: ({Rank:index}),
    })
  }
  catch (err) {
    logger.log('updateLeaderboard', req, err, 'user_breaket_team', req.decoded.user_id);
    res.status(req.constants.HTTP_SERVER_ERROR).json({
      status: req.constants.ERROR,
      code: req.constants.HTTP_SERVER_ERROR,
      message: req.messages.INTERNAL500 + err
    })
  }
}


const updateLeaderboard = async (req,res) => {
  try {
    const bracketType = req.body.bracket_type?req.body.bracket_type:MENSBRACKET;
    const userWiseScore = await updateLeaderboardFunction(req,bracketType)
    res.status(req.constants.HTTP_SUCCESS).json({
      code: req.constants.HTTP_SUCCESS,
      status: req.constants.SUCCESS,
      message: req.messages.RANK.UPDATE,
      data: userWiseScore,
    })
  }
  catch (err) {
    logger.log('updateLeaderboard', req, err, 'user_breaket_team', req.decoded.user_id);
    res.status(req.constants.HTTP_SERVER_ERROR).json({
      status: req.constants.ERROR,
      code: req.constants.HTTP_SERVER_ERROR,
      message: req.messages.INTERNAL500 + err
    })
  }
}
const updateLeaderboardFunction =async (req,bracketType)=>{
  try{
      // let mainBracketIds ="(1,2,3,4,5,15,16,17,18,19)";
      let sqlQuery = `select sum(winner_score ) as score,users.id as userId,users.userName ,"${bracketType}" as bracketType ,user_bracket_id  from user_breaket_teams ubt inner join (select group_concat(game_id) as gameids from tournament_games where bracket_id in (1,2,3,4,5,15,16,17,18,19) and round=1) as gidt inner join (select group_concat(game_id) as gameids from tournament_games where bracket_id in (1,2,3,4,5,15,16,17,18,19) and round=2) as gidt2 inner join tournament_games tgs on (tgs.game_id=ubt.game_id and ubt.team_id= tgs.winner_id) or (ubt.team_id= tgs.winner_id and tgs.bracket_id not in (1,2,3,4,5,15,16,17,18,19,12,13,14,26,27,28) and FIND_IN_SET(ubt.game_id, gidt.gameids)) or (ubt.team_id= tgs.winner_id and tgs.bracket_id in (12,13,14,26,27,28) and FIND_IN_SET(ubt.game_id, gidt2.gameids)) inner join tournament_breakets tbs on tgs.bracket_id=tbs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id  inner join user_breakets ubs on ubs.id = ubt.user_bracket_id  inner join users on users.id=ubs.user_id  where tls.gender = "${bracketType}" group by user_bracket_id,users.id,users.userName  order by score desc limit ${topLeaderboardUser} `;
      const userWiseScore = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT });
      sqlQuery = `delete from leaderboards`
      await req.database.query(sqlQuery)
      await req.models.leaderboard.bulkCreate(userWiseScore);
      return userWiseScore;
  }catch(e){
    console.log('e',e)
  }

}
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
     let userBracket = await req.models.user_breaket.findOne({
      where:{
        id: userBracketId,
      }
    });
    if(userBracket){
    const userBracketDetials = req.body.userBracketDetails;
    const mappedUserBracketDetais = userBracketDetials.map(ele => {
      return {
        user_bracket_id: userBracketId,
        team_id: ele.teamId,
        game_id: ele.gameId,
        team1Score:ele.team1Score,
        team2Score:ele.team2Score
      }
    })
    const upsertBracket = await req.models.user_breaket_team.bulkCreate(mappedUserBracketDetais);
    res.status(req.constants.HTTP_SUCCESS).json({ status: req.constants.SUCCESS, code: req.constants.HTTP_SUCCESS, message: req.messages.USER_BRACKET_TEAMS.UPSERT, data: upsertBracket });
  }else{
    logger.log(req.messages.USER_BRACKET.UNSUCCESSFULL, req, 'user_breaket_team');
    res.status(req.constants.HTTP_ALREADY_EXISTS).json({
      status: req.constants.ERROR,
      code: req.constants.HTTP_ALREADY_EXISTS,
      message: req.messages.USER_BRACKET_TEAMS.NOTMATCHED,
      data: null
     })
  }
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
  getRank,
  updateLeaderboard,
  tieBreakerResolver,
  getUserRank
}