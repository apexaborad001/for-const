const logger = require('../helper/logger-helper');
const {  getRoundWiseDetailsInFormat } = require('../util')
const topLeaderboardUser = 10;
const getUserRank = async (req, res) => {
    try {
      let index = -1;
      let userid = req.decoded.user_id;
      const bracketType = req.body.bracket_type;
      const userRank = await getUserRankFunction(req, bracketType)
      userRank.find((item, i) => {
        if (item.userId === userid) {
          index = i + 1;
          return i;
        }
      })
      res.status(req.constants.HTTP_SUCCESS).json({
        code: req.constants.HTTP_SUCCESS,
        status: req.constants.SUCCESS,
        message: req.messages.RANK.USERRANK,
        data: ({ Rank: index }),
      })
    }
    catch (err) {
      logger.log('getUserRank', req, err, 'getUserRank', userid);
      res.status(req.constants.HTTP_SERVER_ERROR).json({
        status: req.constants.ERROR,
        code: req.constants.HTTP_SERVER_ERROR,
        message: req.messages.INTERNAL500 + err
      })
    }
  }
  const getRank = async (req, res) => {
    try {
      let counter = 1
      const userBracketId = req.body.user_bracket_id;
      const sql = `SELECT userId,score,userName from leaderboards inner join user_breakets on user_breakets.type = leaderboards.bracketType where user_breakets.id = ${userBracketId}`
      const leaderboardData = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })
      for (ele of leaderboardData) {
        ele.rank = counter;
        counter++;
      }
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
  const getRoundWiseScore = async (req, res) => {
    try {
      let userId = req.decoded.user_id;
      const bracketId = req.body.user_bracket_id;
      const sqlQuery = `SELECT tls.gender,tgs.round,sum(tgs.winner_score ) as score ,ubt.user_bracket_id FROM user_breaket_teams ubt inner JOIN tournament_games tgs on ubt.game_id=tgs.game_id inner join user_breakets ubs on ubs.id = ubt.user_bracket_id inner join tournament_breakets tbs on tbs.bracket_id=tgs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id where ubs.user_id=${userId} and ubt.winner_id=tgs.winner_id and ubt.user_bracket_id=${bracketId} and tls.gender=ubs.type group by user_bracket_id,tls.gender,tgs.round order by round;`
      const roundWiseQueryResult = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT })
      if (!roundWiseQueryResult.length) {
        logger.log('getRoundWiseScore', req, '', 'user_breaket_team', userId);
        res.status(req.constants.HTTP_SUCCESS).json({
          code: req.constants.HTTP_SUCCESS,
          status: req.constants.SUCCESS,
          message: req.messages.SCORE.SUCCESS,
          data: roundWiseQueryResult,
        })
      }
  
      let bracketgender = roundWiseQueryResult[0].gender
      console.log(bracketgender)
      const roundWiseScoreObject = await getRoundWiseDetailsInFormat(roundWiseQueryResult, bracketId, bracketgender)
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
  
  
  const getUserRankFunction = async (req, bracketType) => {
    let sqlQuery = `select sum(tgs.winner_score ) as score,users.id as userId,users.userName ,tls.gender as bracketType ,user_bracket_id  from user_breaket_teams ubt inner JOIN tournament_games tgs on ubt.game_id=tgs.game_id inner join user_breakets ubs on ubs.id = ubt.user_bracket_id inner join tournament_breakets tbs on tbs.bracket_id=tgs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id inner join users on users.id=ubs.user_id  where tls.gender = "${bracketType}" and ubt.winner_id=tgs.winner_id and ubs.id = ubt.user_bracket_id group by user_bracket_id,users.id,users.userName,tls.gender order by score desc`;
    const userRank = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT });
    return userRank;
  };
  const updateLeaderboard = async (req, res) => {
    try {
      const bracketType = req.body.bracket_type;
      const userWiseScore = await updateLeaderboardFunction(req, bracketType)
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
  const updateLeaderboardFunction = async (req, bracketType) => {
    try {
      // let mainBracketIds ="(1,2,3,4,5,15,16,17,18,19)";
      let sqlQuery = `select sum(tgs.winner_score ) as score,users.id as userId,users.userName ,tls.gender as bracketType ,user_bracket_id  from user_breaket_teams ubt inner JOIN tournament_games tgs on ubt.game_id=tgs.game_id inner join user_breakets ubs on ubs.id = ubt.user_bracket_id inner join tournament_breakets tbs on tbs.bracket_id=tgs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id inner join users on users.id=ubs.user_id  where tls.gender = "${bracketType}" and ubt.winner_id=tgs.winner_id and ubs.id = ubt.user_bracket_id group by user_bracket_id,users.id,users.userName,tls.gender order by score desc limit ${topLeaderboardUser}`;
      const userWiseScore = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT });
      sqlQuery = `delete from leaderboards where bracketType="${bracketType}"`
      await req.database.query(sqlQuery)
      await req.models.leaderboard.bulkCreate(userWiseScore);
      return userWiseScore;
    } catch (e) {
      console.log('e', e)
    }
  
  }

  module.exports = {
    getRoundWiseScore,
    getRank,
    updateLeaderboard,
    getUserRank,
    updateLeaderboardFunction,
  }