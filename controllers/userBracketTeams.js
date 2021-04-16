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
      await util.insertUserBracketDetails(req,bracketType,createBreaket.id)
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
    const sqlQuery = `SELECT tls.gender,tgs.round,sum(tgs.winner_score ) as score ,ubt.user_bracket_id FROM user_breaket_teams ubt inner JOIN tournament_games tgs on ubt.game_id=tgs.game_id inner join user_breakets ubs on ubs.id = ubt.user_bracket_id inner join tournament_breakets tbs on tbs.bracket_id=tgs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id where ubs.user_id=${userId} and ubt.winner_id=tgs.winner_id and ubt.user_bracket_id=${bracketId} and tls.gender=ubs.type group by user_bracket_id order by round;` 
    const roundWiseQueryResult = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT })
    let bracketgender=roundWiseQueryResult[0].gender
    const roundWiseScoreObject = await getRoundWiseDetailsInFormat(roundWiseQueryResult,bracketId,bracketgender)
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
    let counter=1
    const userBracketId = req.body.user_bracket_id;
    const sql = `SELECT userId,score,userName from leaderboards inner join user_breakets on user_breakets.type = leaderboards.bracketType where user_breakets.id = ${userBracketId}`
    const leaderboardData = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })
    for (ele of leaderboardData){
      ele.rank=counter;
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

const getUserRankFunction= async (req,bracketType)=>{
  let sqlQuery = `select sum(tgs.winner_score ) as score,users.id as userId,users.userName ,"${bracketType}" as bracketType ,user_bracket_id  from user_breaket_teams ubt inner JOIN tournament_games tgs on ubt.game_id=tgs.game_id inner join user_breakets ubs on ubs.id = ubt.user_bracket_id inner join tournament_breakets tbs on tbs.bracket_id=tgs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id inner join users on users.id=ubs.user_id  where tls.gender = "${bracketType}" and ubt.winner_id=tgs.winner_id and ubs.id = ubt.user_bracket_id group by user_bracket_id,users.id,users.userName order by score desc`;
  const userRank= await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT });
  return userRank;
};

const getUserRank = async (req,res) => {
  try {
    var index = -1;
    let userid = req.decoded.user_id;
    const bracketType = req.body.bracket_type;
    const userRank = await getUserRankFunction(req,bracketType)
    userRank.find((item, i)=>{
      if(item.userId === userid){
        index = i+1;
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
    logger.log('getUserRank', req, err, 'getUserRank', userid);
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
      let sqlQuery = `select sum(tgs.winner_score ) as score,users.id as userId,users.userName ,"${bracketType}" as bracketType ,user_bracket_id  from user_breaket_teams ubt inner JOIN tournament_games tgs on ubt.game_id=tgs.game_id inner join user_breakets ubs on ubs.id = ubt.user_bracket_id inner join tournament_breakets tbs on tbs.bracket_id=tgs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id inner join users on users.id=ubs.user_id  where tls.gender = "${bracketType}" and ubt.winner_id=tgs.winner_id and ubs.id = ubt.user_bracket_id group by user_bracket_id,users.id,users.userName order by score desc limit ${topLeaderboardUser}`;
      const userWiseScore = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT });
      sqlQuery = `delete from leaderboards where bracketType="${bracketType}"`
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
    // let userBracketId
    const userBracketDetails = JSON.parse(req.body.userBracketDetails);
    let userBracketId = userBracketDetails[0].user_bracket_id;
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
    //const userBracketDetials = req.body.userBracketDetails;
    
    const upsertBracket = await req.models.user_breaket_team.bulkCreate(userBracketDetails);
    res.status(req.constants.HTTP_SUCCESS).json({ status: req.constants.SUCCESS, code: req.constants.HTTP_SUCCESS, message: req.messages.USER_BRACKET_TEAMS.UPSERT, data: upsertBracket });
  }else{
    logger.log(req.messages.USER_BRACKET.UNSUCCESSFULL, req, 'user_breaket_team');
    res.status(req.constants.HTTP_BAD_REQUEST).json({
      status: req.constants.ERROR,
      code: req.constants.HTTP_BAD_REQUEST,
      message: req.messages.USER_BRACKET_TEAMS.INVALIDBRACKET,
      data: null
     })
  }
}
  catch (error) {
    logger.log('Upsert Bracket', req, error, 'user_breaket_team', req.decoded.user_id);
    res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + error });
  }
};

const getUserBracketDetails = async(req, res) =>{  
  try{

      let userId = req.decoded.user_id;
      const userName = req.decoded.userName;
      let bracketType = req.params.bracketType;
      let bracket = await req.models.user_breaket.findOne({
        where: {
          user_id: userId,
          type:bracketType
        }
      });
      if (!bracket) {
        let bracketName = `${userName}-${bracketType}-bracket`;
        let userBracketData = {
          user_id: userId,
          name: bracketName,
          type:bracketType
        };
        const createBreaket = await req.models.user_breaket.create(userBracketData);
        await util.insertUserBracketDetails(req,bracketType,createBreaket.id)
      }

      let sql = `select ubt.user_bracket_id ,tls.league_id, tls.name as league_name, tls.gender as league_team_gender, tbs.bracket_id, tbs.bracket_position, tbs.devision, tbs.round_labels,ubt.game_id, ubt.team_1_id,ubt.team_2_id,ubt.winner_id, tgs.round,tgs.position, tm1.name as t1_name, tm1.thumbnails as t1_thumbnails, tm2.name as t2_name, tm2.thumbnails as t2_thumbnails, tm2.division_teamid as division_teamid2, tm1.division_teamid as division_teamid1, lbr.position_relation as lbr_position_relation, wbr.position_relation, wbr.nextbracketid as wbr_nextbracketid, wbr.nextround as wbr_nextround, lbr.nextbracketid as lbr_nextbracketid, lbr.nextround as lbr_nextround, tgs.team1_score, tgs.team2_score from tournament_leagues tls inner join 
      tournament_breakets tbs on tls.current_subseason_id = tbs.subseason_id inner join tournament_games tgs on  tgs.bracket_id = tbs.bracket_id left join user_breaket_teams ubt on ubt.game_id = tgs.game_id left join tournament_teams tm1 on tm1.team_id=ubt.team_1_id left join tournament_teams tm2 on tm2.team_id=ubt.team_2_id left join winner_brackt_relation wbr on wbr.bracket_id =tgs.bracket_id and wbr.round = tgs.round left join loser_brackt_relation lbr on lbr.bracket_id =tgs.bracket_id and lbr.round = tgs.round  inner join user_breakets ubs on ubs.id=ubt.user_bracket_id where tls.gender = "${bracketType}" and ubs.user_id = ${userId};`
      let bracketData = await req.database.query(sql, { type: req.database.QueryTypes.SELECT });
      let final_data={};
      for(let row of bracketData){ 
         // let league_id = row["league_id"];
          let {bracket_id, league_id, game_id,team_1_id,team_2_id,winner_id,round, position, t1_name, t1_thumbnails,t2_name,t2_thumbnails, division_teamid2, division_teamid1, team1_score, team2_score } = row;
          if(!final_data[league_id]) {
              final_data[league_id] = {};
              final_data[league_id].league_name = row["league_name"];
              final_data[league_id]["league_team_gender"] = row["league_team_gender"];
              final_data[league_id]["round_labels"] = row["round_labels"];
              final_data[league_id]["brackets"] = {};
              final_data[league_id]["brackets"][bracket_id] = {};
              final_data[league_id]["brackets"][bracket_id]["bracket_position"] = row["bracket_position"];
              final_data[league_id]["brackets"][bracket_id]["devision"] = row["devision"];
              final_data[league_id]["brackets"][bracket_id]["games"] = [];
          }else if(!final_data[league_id]["brackets"][bracket_id]){
              final_data[league_id]["brackets"][bracket_id] = {};
              final_data[league_id]["brackets"][bracket_id]["bracket_position"] = row["bracket_position"];
              final_data[league_id]["brackets"][bracket_id]["devision"] = row["devision"];
              final_data[league_id]["brackets"][bracket_id]["games"] = [];
          }
          let winner_nextbracketid = row["wbr_nextbracketid"];
          let winner_nextround = row["wbr_nextround"];
          let loser_nextbracketid = row["lbr_nextbracketid"];
          let loser_nextround = row["lbr_nextround"];
          let nextPostion = 0;
          let is_odd = true;
          let winner_team_key = "team_1_id";
          let loser_team_key = "team_1_id";
          if(row["position"]%2 == 0) {
              is_odd = false;
              winner_team_key = "team_2_id";
              loser_team_key = "team_2_id";
          }
          if(row["position_relation"]){
              let found = row["position_relation"].split(",").find(element => element.split(":")[0]==row["position"]);
              if(found){
              let splitData = found.split(":");
              nextPostion = splitData[1];
              }
          }

          if(!nextPostion && !is_odd){
              nextPostion = row["position"]/2;    
          }else if(!nextPostion) {
              nextPostion = (row["position"]+1)/2; 
          }
          let loserNextPosition = nextPostion;
          if(row["lbr_position_relation"]){
              let found = row["lbr_position_relation"].split(",").find(element => element.split(":")[0]==row["position"]);
              if(found){
                  loserNextPosition = found.split(":")[1];
              }
          }
          
          let team1 = {
              team_id:team_1_id,
              name:t1_name,
              thumbnails:t1_thumbnails,
              division_teamid:division_teamid1
          }
          let team2 = {
              team_id:team_2_id,
              name:t2_name,
              thumbnails:t2_thumbnails,
              division_teamid:division_teamid2
          }
          final_data[league_id]["brackets"][bracket_id]["games"].push({game_id, bracket_id, round, position, winner_id, team1, team2, winner_nextbracketid, winner_nextround, nextPostion, loser_nextbracketid, loserNextPosition, loser_nextround, winner_team_key, loser_team_key, team1_score, team2_score })
      }
      final_data = Object.values(final_data);
      for(let i in final_data){
              let brackts = [];
              for(let j in final_data[i]['brackets']){
                  brackts.push(final_data[i]['brackets'][j])
              }
              final_data[i]['brackets'] = brackts;
      }
      //console.log(final_data);
      return res.status(req.constants.HTTP_SUCCESS).json({ 
          status: req.constants.SUCCESS, 
          code: req.constants.HTTP_SUCCESS,
          data: Object.values(final_data), 
          message: "game list fetched succesfully"
      });
  }catch(err){
      console.log(err);
     return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + err });
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
  getUserRank,
  getUserBracketDetails
}