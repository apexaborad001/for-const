const logger = require('../helper/logger-helper');
const {  getRoundWiseDetailsInFormat } = require('../util')
const topLeaderboardUser = 10;
const moment = require("moment");
const getUserRank = async (req, res) => {
    try {
      let index = -1;
      let score = [];
      let userid = req.decoded.user_id;
      const UserData      = await getUserBracketGender(req, req.decoded.user_id);
      let mensRank = {"score":0, "rank":"-1"};
      let weMensRank = {"score":0, "rank":"-1"};
      if(UserData.length > 0){
      	for(let row of UserData){
		if(row["type"] == "male"){
			mensRank = await getUserRankFunctionNew(req, "male", req.decoded.user_id);
		}else{
                   weMensRank = await getUserRankFunctionNew(req, "female", req.decoded.user_id);
                }
	}
      }

      
      
      /*const bracketType = req.body.bracket_type;
      const userRank = await getUserRankFunction(req, bracketType)
      userRank.find((item, i) => {
        if (item.userId === userid) {
          index = i + 1;
          score = item;
          
          return i;
        }
      })*/
      res.status(req.constants.HTTP_SUCCESS).json({
        code: req.constants.HTTP_SUCCESS,
        status: req.constants.SUCCESS,
        message: req.messages.RANK.USERRANK,
        data: ({ mensRank, "womensRank":weMensRank }),
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
  const getUserBrackets = async (req, res) => {
    try {
      let userid = req.decoded.user_id;
      let sqlQuery = `select type as gender, id as user_bracket_id from user_breakets where user_id = ${userid};`;
       const userBrackets = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT });
    
       res.status(req.constants.HTTP_SUCCESS).json({
        code: req.constants.HTTP_SUCCESS,
        status: req.constants.SUCCESS,
        message: "date fetched",
        data: ({ userBrackets}),
      })
    }
    catch (err) {
      logger.log('getUserBrackets', req, err, 'getUserBrackets', req.decoded.user_id);
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
      const sql = `SELECT userId, score, userName from leaderboards inner join user_breakets on user_breakets.type = leaderboards.bracketType where user_breakets.id = ${userBracketId}`
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
      const sqlQuery = `SELECT tls.gender,tgs.round,sum(tgs.winner_score ) as score ,ubt.user_bracket_id, tls.name FROM user_breaket_teams ubt inner JOIN tournament_games tgs on ubt.game_id=tgs.game_id inner join user_breakets ubs on ubs.id = ubt.user_bracket_id inner join tournament_breakets tbs on tbs.bracket_id=tgs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id where ubs.user_id=${userId} and ubt.winner_id=tgs.winner_id and ubt.user_bracket_id=${bracketId} and tls.gender=ubs.type group by user_bracket_id, tls.name, tls.gender,tgs.round order by tls.name, round;`
      const roundWiseQueryResult = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT });
      let bracketgender = "male";
      if (!roundWiseQueryResult.length) {
        let sqlQuery = `select type from user_breakets where id = ${bracketId};`;
    	const userRank = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT });
    	if(userRank[0] && userRank[0]["type"] == "female"){
    		bracketgender = "female"	
    	}
      }else{
	    bracketgender = roundWiseQueryResult[0].gender;      
      }
  

      //console.log(bracketgender)
      const roundWiseScoreObject = await getRoundWiseDetailsInFormat(roundWiseQueryResult, bracketId, bracketgender);
      const sql = `select sum(tgs.winner_score ) as score, users.id as userId, users.userName, RANK() OVER ( order by sum(tgs.winner_score ) desc) as "rank", user_images.image_path, user_images.name as image_name from user_breaket_teams ubt inner JOIN tournament_games tgs on ubt.game_id=tgs.game_id inner join user_breakets ubs on ubs.id = ubt.user_bracket_id inner join tournament_breakets tbs on tbs.bracket_id=tgs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id inner join users on users.id=ubs.user_id left join user_images on user_images.user_id = users.id  where tls.gender = "${bracketgender}" and ubt.winner_id=tgs.winner_id and ubs.id = ubt.user_bracket_id group by users.id limit 20`
      const leaderboardData = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })
      
      let userRankData = await getUserRankFunctionNew(req, bracketgender, req.decoded.user_id);
      
      //logger.log('getRoundWiseScore', req, '', 'user_breaket_team', userId);
      res.status(req.constants.HTTP_SUCCESS).json({
        code: req.constants.HTTP_SUCCESS,
        status: req.constants.SUCCESS,
        message: req.messages.SCORE.SUCCESS,
        data: {roundWiseScoreObject, leaderboardData, userRankData, image_prefix:process.env.BUCKET_ACCESS_URL}
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
    let sqlQuery = `select sum(tgs.winner_score ) as score,users.id as userId,users.userName from user_breaket_teams ubt inner JOIN tournament_games tgs on ubt.game_id=tgs.game_id inner join user_breakets ubs on ubs.id = ubt.user_bracket_id inner join tournament_breakets tbs on tbs.bracket_id=tgs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id inner join users on users.id=ubs.user_id  where tls.gender = "${bracketType}" and ubt.winner_id=tgs.winner_id and ubs.id = ubt.user_bracket_id group by users.id order by score desc`;
    const userRank = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT });
    return userRank;
  };
   const getUserRankFunctionNew = async (req, bracketType, userID) => {
    //let sqlQuery = `select * from (select sum(tgs.winner_score ) as score,users.id as userId,users.userName, RANK() OVER ( order by sum(tgs.winner_score ) desc) as "rank" from user_breaket_teams ubt inner JOIN tournament_games tgs on ubt.game_id=tgs.game_id inner join user_breakets ubs on ubs.id = ubt.user_bracket_id inner join tournament_breakets tbs on tbs.bracket_id=tgs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id inner join users on users.id=ubs.user_id  where tls.gender = "${bracketType}" and ubt.winner_id=tgs.winner_id and ubs.id = ubt.user_bracket_id group by users.id) as t where t.userId = ${userID} ;`;
    let sqlQuery = `select * from leaderboards where userId = ${userID} and bracketType = "${bracketType}" ;`;
    const userRank = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT });
    return userRank;
  };
  
  const getUserBracketGender = async (req, userID) => {
    let sqlQuery = `select type from user_breakets where user_id = ${userID};`;
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
      //let sqlQuery = `select sum(tgs.winner_score ) as score,users.id as userId,users.userName ,tls.gender as bracketType ,user_bracket_id  from user_breaket_teams ubt inner JOIN tournament_games tgs on ubt.game_id=tgs.game_id inner join user_breakets ubs on ubs.id = ubt.user_bracket_id inner join tournament_breakets tbs on tbs.bracket_id=tgs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id inner join users on users.id=ubs.user_id  where tls.gender = "${bracketType}" and ubt.winner_id=tgs.winner_id and ubs.id = ubt.user_bracket_id group by user_bracket_id,users.id,users.userName,tls.gender order by score desc limit ${topLeaderboardUser}`;
      
      let sqlQuery1 = `delete from leaderboards where bracketType="${bracketType}"`
      await req.database.query(sqlQuery1)
      
      
      let date2 = new Date();
      let dateTime = moment(date2).format("YYYY-MM-DD HH:mm:ss");

      let sqlQuery = `insert INTO leaderboards select NULL as id, users.id as userId, users.userName, ubs.type, sum(tgs.winner_score ) as score, RANK() OVER ( order by sum(tgs.winner_score ) desc) as "rank", "${dateTime}" as createdAt, "${dateTime}" as updatedAt from user_breaket_teams ubt inner JOIN tournament_games tgs on ubt.game_id=tgs.game_id and ubt.winner_id=tgs.winner_id inner join user_breakets ubs on ubs.id = ubt.user_bracket_id inner join users on users.id = ubs.user_id  where ubs.type = "${bracketType}" group by users.id;`;
      
      const userWiseScore = await req.database.query(sqlQuery, { type: req.database.QueryTypes.UPDATE });
      //await req.models.leaderboard.bulkCreate(userWiseScore);
      return userWiseScore;
    } catch (e) {
      console.log('e', e)
    }
  
  }
  
  const getUserScore = async (req, res) => {
    try {
      let userId = req.decoded.user_id;
      const sqlQuery = `SELECT sum(tgs.winner_score) as score, ubs.type as gemder FROM user_breaket_teams ubt inner JOIN tournament_games tgs on ubt.game_id=tgs.game_id  and ubt.winner_id=tgs.winner_id inner join user_breakets ubs on ubs.id = ubt.user_bracket_id where ubs.user_id=${userId} group by ubs.type order by ubs.type;`
      const roundWiseQueryResult = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT })
      let result = {"mens":0, "womens":0};
      if (!roundWiseQueryResult.length) {
        res.status(req.constants.HTTP_SUCCESS).json({
          code: req.constants.HTTP_SUCCESS,
          status: req.constants.SUCCESS,
          message: req.messages.SCORE.SUCCESS,
          data: result,
        })
      }
      for(let score of roundWiseQueryResult){
        if(score["gemder"] == "male"){
          result["mens"] = score["score"];
        }else{
          result["mens"] = score["score"];
        }
      }
      res.status(req.constants.HTTP_SUCCESS).json({
        code: req.constants.HTTP_SUCCESS,
        status: req.constants.SUCCESS,
        message: req.messages.SCORE.SUCCESS,
        data: result,
      })
    }
  
    catch (err) {
      //logger.log('getRoundWiseScore', req, err, 'user_breaket_team', userId);
      res.status(req.constants.HTTP_SERVER_ERROR).json({
        status: req.constants.ERROR,
        code: req.constants.HTTP_SERVER_ERROR,
        message: req.messages.INTERNAL500 + err
      })
    }
  };
  
  const getTopRanks = async (req, res) => {
    try {
       const sql = `select sum(tgs.winner_score ) as score, users.id as userId, users.userName, RANK() OVER ( order by sum(tgs.winner_score ) desc) as "rank", user_images.image_path, user_images.name as image_name  from user_breaket_teams ubt inner JOIN tournament_games tgs on ubt.game_id=tgs.game_id inner join user_breakets ubs on ubs.id = ubt.user_bracket_id inner join tournament_breakets tbs on tbs.bracket_id=tgs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id inner join users on users.id=ubs.user_id left join user_images on user_images.user_id = users.id where tls.gender = "male" and ubt.winner_id=tgs.winner_id and ubs.id = ubt.user_bracket_id group by users.id limit 20`
       const maleRanks = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })
      
       const sql2 = `select sum(tgs.winner_score ) as score, users.id as userId, users.userName, RANK() OVER ( order by sum(tgs.winner_score ) desc) as "rank", user_images.image_path, user_images.name as image_name from user_breaket_teams ubt inner JOIN tournament_games tgs on ubt.game_id=tgs.game_id inner join user_breakets ubs on ubs.id = ubt.user_bracket_id inner join tournament_breakets tbs on tbs.bracket_id=tgs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id inner join users on users.id=ubs.user_id left join user_images on user_images.user_id = users.id  where tls.gender = "female" and ubt.winner_id=tgs.winner_id and ubs.id = ubt.user_bracket_id group by users.id limit 20`
      const femaleRank = await req.database.query(sql2, { type: req.database.QueryTypes.SELECT })
      
       res.status(req.constants.HTTP_SUCCESS).json({
        code: req.constants.HTTP_SUCCESS,
        status: req.constants.SUCCESS,
        message: req.messages.SCORE.SUCCESS,
        data: {maleRanks, femaleRank, image_prefix:process.env.BUCKET_ACCESS_URL}
      })
    }
  
    catch (err) {
      logger.log('getTopRanks', req, err, 'getTopRanks', userId);
      res.status(req.constants.HTTP_SERVER_ERROR).json({
        status: req.constants.ERROR,
        code: req.constants.HTTP_SERVER_ERROR,
        message: req.messages.INTERNAL500 + err
      })
    }
  };

   

  module.exports = {
    getRoundWiseScore,
    getRank,
    updateLeaderboard,
    getUserRank,
    updateLeaderboardFunction,
    getUserScore,
    getUserBrackets,
    getTopRanks
  }
