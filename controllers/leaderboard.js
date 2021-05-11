const logger = require('../helper/logger-helper');
const {  getRoundWiseDetailsInFormat } = require('../util')
const topLeaderboardUser = 10;
const moment = require("moment");
const getUserBrackets = async (req, res) => {
    try {
      let userid = req.decoded.user_id;
      let sqlQuery = `select type as gender, id as user_bracket_id from user_breakets where user_id = ${userid};`;
       const userBrackets = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT });
    
       return res.status(req.constants.HTTP_SUCCESS).json({
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
  
 
  const getRoundWiseScore = async (req, res) => {
    try {
      let userId = req.decoded.user_id;
      const bracketId = req.body.user_bracket_id;
      const sqlQuery = `SELECT tls.gender, tgs.round,sum(tgs.winner_score ) as score, ubt.user_bracket_id, tls.name FROM user_breaket_teams ubt inner JOIN tournament_games tgs on ubt.game_id=tgs.game_id and ubt.winner_id=tgs.winner_id inner join user_breakets ubs on ubs.id = ubt.user_bracket_id inner join tournament_breakets tbs on tbs.bracket_id=tgs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id where ubt.user_bracket_id=${bracketId} group by user_bracket_id, tls.name, tls.gender,tgs.round order by tls.name, round;`
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
  
      const roundWiseScoreObject = await getRoundWiseDetailsInFormat(roundWiseQueryResult, bracketId, bracketgender);
      
      let userRankData = await getUserRankFunctionNew(req, bracketgender, req.decoded.user_id);
      
      return res.status(req.constants.HTTP_SUCCESS).json({
        code: req.constants.HTTP_SUCCESS,
        status: req.constants.SUCCESS,
        message: req.messages.SCORE.SUCCESS,
        data: {roundWiseScoreObject,  userRankData, image_prefix:process.env.BUCKET_ACCESS_URL}
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
  
  
  const getUserRankFunctionNew = async (req, bracketType, userID) => {
    let sqlQuery = `select * from leaderboards where userId = ${userID} and bracketType = "${bracketType}" ;`;
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
         
      let sqlQuery1 = `delete from leaderboards where bracketType="${bracketType}"`
      await req.database.query(sqlQuery1)
      
      
      let date2 = new Date();
      let dateTime = moment(date2).format("YYYY-MM-DD HH:mm:ss");

      let sqlQuery = `insert INTO leaderboards select NULL as id, users.id as userId, users.userName, ubs.type, sum(tgs.winner_score ) as score, RANK() OVER ( order by sum(tgs.winner_score ) desc) as "rank", "${dateTime}" as createdAt, "${dateTime}" as updatedAt, ubs.id as winner_id from user_breaket_teams ubt inner JOIN tournament_games tgs on ubt.game_id=tgs.game_id and ubt.winner_id=tgs.winner_id inner join user_breakets ubs on ubs.id = ubt.user_bracket_id inner join users on users.id = ubs.user_id  where ubs.type = "${bracketType}" group by users.id;`;
      
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
      logger.log('getUserScore', req, err, 'user_breaket_team', userId);
      res.status(req.constants.HTTP_SERVER_ERROR).json({
        status: req.constants.ERROR,
        code: req.constants.HTTP_SERVER_ERROR,
        message: req.messages.INTERNAL500 + err
      })
    }
  };
  
  const getTopRanks = async (req, res) => {
    try {
       
       let maleRanks = [];
       let femaleRank = [];
       let allRank = [];
       let count = [];
       let gender = req.query.gender;
       let start = req.query.start;
       let end = req.query.end;
       if(gender == "male" || gender == "female"){
       		let sql = `select count(id) as count from leaderboards ldr where ldr.bracketType = "${gender}"`
      		count = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })
      		count = count[0];
      		let game_id="31";
      		if(gender=="female"){
      		   game_id="79"
      		}
      		const sql2 = `select ldr.*, user_images.image_path, user_images.name as image_name, tms.name as winner_team from leaderboards ldr left join user_breaket_teams ubt on ubt.user_bracket_id = ldr.winner_id and ubt.game_id=${game_id} left join user_images on user_images.user_id = ldr.userId left join tournament_teams tms on tms.team_id = ubt.winner_id where ldr.bracketType = "${gender}" limit ${start}, ${end}`
     		allRank = await req.database.query(sql2, { type: req.database.QueryTypes.SELECT })
       
       }else{
       
	       let sql = `select ldr.*, user_images.image_path, user_images.name as image_name from leaderboards ldr left join user_images on user_images.user_id = ldr.userId  where ldr.bracketType = "male" limit 20`
	       maleRanks = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })
	      
	       const sql2 = `select ldr.*, user_images.image_path, user_images.name as image_name from leaderboards ldr left join user_images on user_images.user_id = ldr.userId  where ldr.bracketType = "female" limit 20`
	       femaleRank = await req.database.query(sql2, { type: req.database.QueryTypes.SELECT })
       }
       res.status(req.constants.HTTP_SUCCESS).json({
        code: req.constants.HTTP_SUCCESS,
        status: req.constants.SUCCESS,
        message: req.messages.SCORE.SUCCESS,
        data: {maleRanks, femaleRank, count, allRank, image_prefix:process.env.BUCKET_ACCESS_URL}
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

  const getUserRank = async (req, res) => {
    try {
      let userid = req.decoded.user_id;      
      let sqlQuery = `select * from leaderboards where userId = ${userid};`;
      const userRank = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT });
      
      let mensRank = {"score":0, "rank":"-1"};
      let weMensRank = {"score":0, "rank":"-1"};
      if(userRank.length > 0){
      	for(let row of userRank){
		if(row["bracketType"] == "male"){
			mensRank = row;
		}else{
                   weMensRank = row;
                }
	}
      }

      return res.status(req.constants.HTTP_SUCCESS).json({
        code: req.constants.HTTP_SUCCESS,
        status: req.constants.SUCCESS,
        message: req.messages.RANK.USERRANK,
        data: ({ mensRank, "womensRank":weMensRank }),
      })
    }
    catch (err) {
      logger.log('getUserRank', req, err, 'getUserRank', req.decoded.user_id);
      return res.status(req.constants.HTTP_SERVER_ERROR).json({
        status: req.constants.ERROR,
        code: req.constants.HTTP_SERVER_ERROR,
        message: req.messages.INTERNAL500 + err
      })
    }
  }

  module.exports = {
    getRoundWiseScore,
    updateLeaderboard,
    updateLeaderboardFunction,
    getUserScore,
    getUserBrackets,
    getTopRanks,
    getUserRank
  }
