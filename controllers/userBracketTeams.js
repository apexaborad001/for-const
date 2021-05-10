const Sequelize = require('sequelize');
const logger = require('../helper/logger-helper');
const { exec } = require("child_process");
const helper = require('../helper/common-helper');
const path = require("path");
const fs = require("fs");
const {  insertUserBracketDetails, tieBreakerResolverFunction } = require('../util')
const util = require('../util')
const moment = require("moment");

const tieBreakerResolver = async (req, res) => {
  try {
    let userBracketId1 = req.body.user_BracketId1
    let userBracketId2 = req.body.user_BracketId2
    const tieBreakerResolverResult = await tieBreakerResolverFunction(req, userBracketId1, userBracketId2)
    res.status(req.constants.HTTP_SUCCESS).json({
      code: req.constants.HTTP_SUCCESS,
      status: req.constants.SUCCESS,
      message: req.messages.TIEBREAKER.SUCCESS,
      data: tieBreakerResolverResult,
    })
  } catch (err) {
    res.status(req.constants.HTTP_SERVER_ERROR).json({
      status: req.constants.ERROR,
      code: req.constants.HTTP_SERVER_ERROR,
      message: req.messages.INTERNAL500 + err
    })
  }
}


const upsertBracketDetails = async (req, res) => {
  try {
    const userBracketDetails = JSON.parse(req.body.userBracketDetails);
    let userBracketId = userBracketDetails[0].user_bracket_id;
    req.models.user_breaket_team.destroy({
      where: {
        user_bracket_id: userBracketId
      }
    });
    let userBracket = await req.models.user_breaket.findOne({
      where: {
        id: userBracketId,
      }
    });
    if (userBracket) {
	const upsertBracket = await req.models.user_breaket_team.bulkCreate(userBracketDetails);
       res.status(req.constants.HTTP_SUCCESS).json({ status: req.constants.SUCCESS, code: req.constants.HTTP_SUCCESS, message: req.messages.USER_BRACKET_TEAMS.UPSERT, data: upsertBracket });
      let send_bracket_mail = req.body.send_bracket_mail;
      let bracketType = req.body.bracketType || "male";
    if(send_bracket_mail == "yes"){
        let bracket_name = bracketType =="male"?"Men's Bracket":"Women's Bracket"
    	let template = "afterbractecomplete.html";
        let to_id = req.decoded.email,
        subject = req.messages.MAIL_SUBJECT.BRACKET_SUBMISSION,
        template_name = template,
        replacements = { bracket_name:bracket_name };
        helper.sendEmail(process.env.mailFrom, to_id, subject, template_name, replacements);	
    	
    }
    
    } else {
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

const getUserBracketDetails = async (req, res) => {
  try {

    let isBracketEditable = true;
    //let sqlCheck = `select winner_id from tournament_games where winner_id is not null limit 1 ;`
    //let isAdminUpdated = await req.database.query(sqlCheck, { type: req.database.QueryTypes.SELECT });
    let date2 = new Date();
    let dateTime = moment(date2).format("YYYY-MM-DD HH:mm:ss");
    if (dateTime > req.constants.Bracket_submission_deadline) {
      isBracketEditable = false;
    }
    let isPartiallyFilledBracket = {"male":false, "female":false};
    let isPartiallyFilled=false;
    let isBracketAlreadyCreated = false;
    let userId = req.decoded.user_id;
    const userName = req.decoded.userName;
    let bracketType = req.params.bracketType;
    let userBracketId;
    let bracket = await req.models.user_breaket.findOne({
      where: {
        user_id: userId,
        type: bracketType
      }
    });
    if (!bracket) {
      let bracketName = `${userName}-${bracketType}-bracket`;
      let userBracketData = {
        user_id: userId,
        name: bracketName,
        type: bracketType
      };
      const createBreaket = await req.models.user_breaket.create(userBracketData);
      userBracketId = createBreaket.id;

      await util.insertUserBracketDetails(req, bracketType, createBreaket.id)
    } else {
      isBracketAlreadyCreated = true;
      userBracketId = bracket.id;
    }

    /*let sql = `select ubt.user_bracket_id ,ubt.team_1_score,ubt.team_2_score, tgs.team_1_id as actual_team_1_id,tgs.team_2_id as actual_team_2_id,tgs.winner_id as actual_winner_id, tgs.looser_id as actual_looser_id, tls.league_id, tls.name as league_name, tls.gender as league_team_gender, tbs.bracket_id, tbs.bracket_position, tbs.devision, tbs.round_labels,ubt.game_id, ubt.team_1_id,ubt.team_2_id,ubt.winner_id, tgs.round,tgs.position, tm1.name as t1_name, tm1.thumbnails as t1_thumbnails, tm2.name as t2_name, tm2.thumbnails as t2_thumbnails, tm2.division_teamid as division_teamid2, tm1.division_teamid as division_teamid1, lbr.position_relation as lbr_position_relation, wbr.position_relation, wbr.nextbracketid as wbr_nextbracketid, wbr.nextround as wbr_nextround, lbr.nextbracketid as lbr_nextbracketid, lbr.nextround as lbr_nextround, tgs.team1_score, tgs.team2_score from tournament_leagues tls inner join 
      tournament_breakets tbs on tls.current_subseason_id = tbs.subseason_id inner join tournament_games tgs on  tgs.bracket_id = tbs.bracket_id left join user_breaket_teams ubt on ubt.game_id = tgs.game_id left join tournament_teams tm1 on tm1.team_id=ubt.team_1_id left join tournament_teams tm2 on tm2.team_id=ubt.team_2_id left join winner_brackt_relation wbr on wbr.bracket_id =tgs.bracket_id and wbr.round = tgs.round left join loser_brackt_relation lbr on lbr.bracket_id =tgs.bracket_id and lbr.round = tgs.round  inner join user_breakets ubs on ubs.id=ubt.user_bracket_id where ubs.user_id = ${userId};`*/
      
     let sql = `select ubt.user_bracket_id ,ubt.team_1_score,ubt.team_2_score, tgs.team_1_id as actual_team_1_id,tgs.team_2_id as actual_team_2_id,tgs.winner_id as actual_winner_id, tgs.looser_id as actual_looser_id, tls.league_id, tls.name as league_name, tls.gender as league_team_gender, tbs.bracket_id, tbs.bracket_position, tbs.devision, tbs.round_labels,ubt.game_id, ubt.team_1_id,ubt.team_2_id,ubt.winner_id, tgs.round,tgs.position, tm1.name as t1_name, tm1.thumbnails as t1_thumbnails, tm2.name as t2_name, tm2.thumbnails as t2_thumbnails, tm2.division_teamid as division_teamid2, tm1.division_teamid as division_teamid1, lbr.position_relation as lbr_position_relation, wbr.position_relation, wbr.nextbracketid as wbr_nextbracketid, wbr.nextround as wbr_nextround, lbr.nextbracketid as lbr_nextbracketid, lbr.nextround as lbr_nextround, tgs.team1_score, tgs.team2_score from user_breakets ubs inner join user_breaket_teams ubt on ubt.user_bracket_id = ubs.id inner join tournament_games tgs on tgs.game_id = ubt.game_id inner join tournament_breakets tbs on tbs.bracket_id = tgs.bracket_id  inner join tournament_leagues tls on tbs.subseason_id = tls.current_subseason_id left join tournament_teams tm1 on tm1.team_id=ubt.team_1_id left join tournament_teams tm2 on tm2.team_id=ubt.team_2_id left join winner_brackt_relation wbr on wbr.bracket_id =tgs.bracket_id and wbr.round = tgs.round left join loser_brackt_relation lbr on lbr.bracket_id =tgs.bracket_id and lbr.round = tgs.round where ubs.user_id = ${userId}`;
      
      
    let AllBracketData = await req.database.query(sql, { type: req.database.QueryTypes.SELECT });
    let bracketData =AllBracketData.filter(ele=>ele.league_team_gender === bracketType)
    let otherbracketType = bracketType==="male"?"female":"male";
    let otherBracketData = AllBracketData.filter(ele=>ele.league_team_gender=== otherbracketType && ele.winner_id)
    if(otherBracketData && otherBracketData.length)isPartiallyFilledBracket[otherbracketType] = true;

    let sqlTeam=`SELECT name,team_id, division_teamid FROM tournament_teams;`
    let allteamArray = await req.database.query(sqlTeam, { type: req.database.QueryTypes.SELECT });
    let actual_team_1_name="";
    let actual_team_2_name="";
    let actual_team_1_division_teamid="";
    let actual_team_2_division_teamid="";
    let finalData = {};
    let loser_ids = {};
    for (let row of bracketData) {
      let tem_le_name = row.league_name.replace(" ","_");
      tem_le_name = tem_le_name.replace("'s","");
      
      if(row.actual_looser_id){
        if(!loser_ids[tem_le_name]){
             loser_ids[tem_le_name] = [row.actual_looser_id];
        }else{
       	     loser_ids[tem_le_name].push(row.actual_looser_id);
        }
        
        if(row.actual_winner_id != row.winner_id){
           loser_ids[tem_le_name].push(row.winner_id);
        }        	
      }
      
      if(row.winner_id)
      isPartiallyFilled = true
      // let league_id = row["league_id"];
      let { team_1_score,team_2_score,bracket_id, actual_winner_id, actual_team_1_id,actual_team_2_id,league_id, game_id, team_1_id, team_2_id, winner_id, round, position, t1_name, t1_thumbnails, t2_name, t2_thumbnails, division_teamid2, division_teamid1, team1_score, team2_score } = row;
      const allteamArrayResult=allteamArray.filter(ele=>ele.team_id===actual_team_1_id);
      if(allteamArrayResult && allteamArrayResult.length){
      		actual_team_1_name= allteamArrayResult[0].name;
      		actual_team_1_division_teamid = allteamArrayResult[0].division_teamid;
      }
      //console.log(allteamArrayResult[0].name)
      const allteamArrayResult2=allteamArray.filter(ele=>ele.team_id===actual_team_2_id)
      if(allteamArrayResult2 && allteamArrayResult2.length){
      	      	actual_team_2_name= allteamArrayResult2[0].name;
      		actual_team_2_division_teamid = allteamArrayResult2[0].division_teamid;
      }

       if (!finalData[league_id]) {
        finalData[league_id] = {};
        finalData[league_id].league_name = row["league_name"];
        finalData[league_id]["league_team_gender"] = row["league_team_gender"];
        finalData[league_id]["round_labels"] = row["round_labels"];
        finalData[league_id]["brackets"] = {};
        finalData[league_id]["brackets"][bracket_id] = {};
        finalData[league_id]["brackets"][bracket_id]["bracket_position"] = row["bracket_position"];
        finalData[league_id]["brackets"][bracket_id]["devision"] = row["devision"];
        finalData[league_id]["brackets"][bracket_id]["games"] = [];
      } else if (!finalData[league_id]["brackets"][bracket_id]) {
        finalData[league_id]["brackets"][bracket_id] = {};
        finalData[league_id]["brackets"][bracket_id]["bracket_position"] = row["bracket_position"];
        finalData[league_id]["brackets"][bracket_id]["devision"] = row["devision"];
        finalData[league_id]["brackets"][bracket_id]["games"] = [];
      }
      let winner_nextbracketid = row["wbr_nextbracketid"];
      let winner_nextround = row["wbr_nextround"];
      let loser_nextbracketid = row["lbr_nextbracketid"];
      let loser_nextround = row["lbr_nextround"];
      let nextPostion = 0;
      let is_odd = true;
      let winner_team_key = "team_1_id";
      let loser_team_key = "team_1_id";
      if (row["position"] % 2 == 0) {
        is_odd = false;
        winner_team_key = "team_2_id";
        loser_team_key = "team_2_id";
      }
      if (row["position_relation"]) {
        let found = row["position_relation"].split(",").find(element => element.split(":")[0] == row["position"]);
        if (found) {
          let splitData = found.split(":");
          nextPostion = splitData[1];
        }
      }

      if (!nextPostion && !is_odd) {
        nextPostion = row["position"] / 2;
      } else if (!nextPostion) {
        nextPostion = (row["position"] + 1) / 2;
      }
      let loserNextPosition = nextPostion;
      if (row["lbr_position_relation"]) {
        let found = row["lbr_position_relation"].split(",").find(element => element.split(":")[0] == row["position"]);
        if (found) {
          loserNextPosition = found.split(":")[1];
        }
      }

      let team1 = {
        team_id: team_1_id,
        name: t1_name,
        thumbnails: t1_thumbnails,
        division_teamid: division_teamid1,
        team_1_score
      }
      let team2 = {
        team_id: team_2_id,
        name: t2_name,
        thumbnails: t2_thumbnails,
        division_teamid: division_teamid2,
        team_2_score
      }
      finalData[league_id]["brackets"][bracket_id]["games"].push({ game_id,actual_team_1_id,actual_team_1_name,actual_team_2_name,actual_team_2_id, bracket_id, round, position, winner_id, actual_winner_id, team1, team2, winner_nextbracketid, winner_nextround, nextPostion, loser_nextbracketid, loserNextPosition, loser_nextround, winner_team_key, loser_team_key, team1_score, team2_score, actual_team_1_division_teamid, actual_team_2_division_teamid })
    }
    isPartiallyFilledBracket[bracketType]=isPartiallyFilled;
    for (let i in finalData) {
      finalData[i].user_bracket_id = userBracketId;
      let brackts = [];
      for (let j in finalData[i]['brackets']) {
        brackts.push(finalData[i]['brackets'][j])
      }
      finalData[i]['brackets'] = brackts;
    }
    let userRankData = await getUserRankFunctionNew(req, bracketType, req.decoded.user_id);
    return res.status(req.constants.HTTP_SUCCESS).json({
      status: req.constants.SUCCESS,
      code: req.constants.HTTP_SUCCESS,
      data: {isPartiallyFilledBracket,isBracketEditable, bracketDetails: Object.values(finalData), userBracketId, loser_ids, userRankData},
      message: req.messages.USER_BRACKET_TEAMS.FETCH
    });
  } catch (err) {
    return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + err });
  }
};

const getLatestGames = async (req, res) => {
  try {
    let sql = `SELECT tgs.game_id,tgs.round,tgs.position,tls.gender,tls.name as league_name,tgs.team_1_id,tgs.team_2_id,tgs.winner_id,tm1.name as t1_name,tm1.team_id as team_1_id,tgs.team1_score,tm1.thumbnails as t1_thumbnails,tm2.name as t2_name,tm2.team_id as team_2_id,tgs.team2_score,tm2.thumbnails as t2_thumbnails FROM tournament_games tgs inner join tournament_breakets tbs on tgs.bracket_id=tbs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id left join tournament_teams tm1 on tm1.team_id=tgs.team_1_id left join tournament_teams tm2 on tm2.team_id=tgs.team_2_id where tgs.winner_id is not null order by tgs.updatedAt desc;`
    let bracketData = await req.database.query(sql, { type: req.database.QueryTypes.SELECT });
    let games = [];
    for (let row of bracketData) {
      let {league_name,game_id, round, position,gender,winner_id, team_1_id, team_2_id, t1_name, t1_thumbnails, t2_name, t2_thumbnails,team1_score,team2_score } = row;
      let team1 = {
        team_id: team_1_id,
        name: t1_name,
        thumbnails: t1_thumbnails,
        score:team1_score
      }
      let team2 = {
        team_id: team_2_id,
        name: t2_name,
        thumbnails: t2_thumbnails,
        score:team2_score
      }
      if(gender == "male"){
        gender = "men";
      }else{
        gender = "women";
      }
      games.push({ league_name,game_id, round, position,gender,winner_id,  team1, team2})
    }
    let responseMessage ;
    if(games && games.length)responseMessage=req.messages.GAME.SUCCESS;
    else responseMessage=req.messages.GAME.BLANK;

    return res.status(req.constants.HTTP_SUCCESS).json({
      status: req.constants.SUCCESS,
      code: req.constants.HTTP_SUCCESS,
      message: responseMessage,
      data: {games},
    });
  } catch (err) {
    return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + err });
  }
};

const getUserRankFunctionNew = async (req, bracketType, userID) => { 
    let sqlQuery = `select * from leaderboards where userId = ${userID} and bracketType = "${bracketType}" ;`;
    const userRank = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT });
    return userRank;
};




module.exports = {
  upsertBracketDetails,
  tieBreakerResolver,
  getUserBracketDetails,
  getLatestGames
}
