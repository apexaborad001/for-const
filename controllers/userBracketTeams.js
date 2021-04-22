const Sequelize = require('sequelize');
const logger = require('../helper/logger-helper');
const { exec } = require("child_process");

const {  insertUserBracketDetails, tieBreakerResolverFunction } = require('../util')
const util = require('../util')

const createUserBracket = async (req, res) => {
  try {
    let userId = req.decoded.user_id
    let bracketName = req.body.bracketName
    let bracketType = req.body.bracketType
    let bracket = await req.models.user_breaket.findOne({
      where: {
        user_id: userId,
        type: bracketType
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
        type: bracketType
      };
      const createBreaket = await req.models.user_breaket.create(userBracketData);
      await insertUserBracketDetails(req, bracketType, createBreaket.id)
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
    logger.log('tieBreakerResolver', req, err, 'user_breaket_team', userId);
    res.status(req.constants.HTTP_SERVER_ERROR).json({
      status: req.constants.ERROR,
      code: req.constants.HTTP_SERVER_ERROR,
      message: req.messages.INTERNAL500 + err
    })
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
      where: {
        id: userBracketId,
      }
    });
    if (userBracket) {
      //const userBracketDetials = req.body.userBracketDetails;

      const upsertBracket = await req.models.user_breaket_team.bulkCreate(userBracketDetails);
      res.status(req.constants.HTTP_SUCCESS).json({ status: req.constants.SUCCESS, code: req.constants.HTTP_SUCCESS, message: req.messages.USER_BRACKET_TEAMS.UPSERT, data: upsertBracket });
    } else {
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

const getInCompleteBracketUsers = async (req, res) => {
  try {
    const sql = `select distinct ubs.type,user_bracket_id,ubs.id,ubs.user_id,users.email from user_breaket_teams ubt inner join user_breakets ubs on ubs.id=ubt.user_bracket_id inner join users on ubs.user_id=users.id where ubt.winner_id is null or ubt.team_1_id is null or ubt.team_2_id is null order by user_id`;
    const getQueryResult = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })
    res.status(req.constants.HTTP_SUCCESS).json({
      code: req.constants.HTTP_SUCCESS,
      status: req.constants.SUCCESS,
      message: req.messages.USER_BRACKET_TEAMS_INCOMPLETE.FOUND,
      data: getQueryResult,
    })
  }
  catch (err) {
    logger.log('User bracket', req, err, 'user_breaket_team', req.decoded.user_id);
    res.status(req.constants.HTTP_SERVER_ERROR).json({
      status: req.constants.ERROR,
      code: req.constants.HTTP_SERVER_ERROR,
      message: req.messages.INTERNAL500 + err
    })
  }
}


const getUserBracketDetails = async (req, res) => {
  try {

    let isBracketEditable = true;
    if (new Date() > new Date(req.constants.Bracket_submission_deadline)) {
      isBracketEditable = false;
    }
    let isPartiallyFilledBracket = {"male":false, "female":false};
    let isPartiallyFilled=false;
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
      userBracketId = bracket.id;
    }

    let sql = `select ubt.user_bracket_id ,tgs.team_1_id as actual_team_1_id,tgs.team_2_id as actual_team_2_id,tgs.winner_id as actual_winner_id,tls.league_id, tls.name as league_name, tls.gender as league_team_gender, tbs.bracket_id, tbs.bracket_position, tbs.devision, tbs.round_labels,ubt.game_id, ubt.team_1_id,ubt.team_2_id,ubt.winner_id, tgs.round,tgs.position, tm1.name as t1_name, tm1.thumbnails as t1_thumbnails, tm2.name as t2_name, tm2.thumbnails as t2_thumbnails, tm2.division_teamid as division_teamid2, tm1.division_teamid as division_teamid1, lbr.position_relation as lbr_position_relation, wbr.position_relation, wbr.nextbracketid as wbr_nextbracketid, wbr.nextround as wbr_nextround, lbr.nextbracketid as lbr_nextbracketid, lbr.nextround as lbr_nextround, tgs.team1_score, tgs.team2_score from tournament_leagues tls inner join 
      tournament_breakets tbs on tls.current_subseason_id = tbs.subseason_id inner join tournament_games tgs on  tgs.bracket_id = tbs.bracket_id left join user_breaket_teams ubt on ubt.game_id = tgs.game_id left join tournament_teams tm1 on tm1.team_id=ubt.team_1_id left join tournament_teams tm2 on tm2.team_id=ubt.team_2_id left join winner_brackt_relation wbr on wbr.bracket_id =tgs.bracket_id and wbr.round = tgs.round left join loser_brackt_relation lbr on lbr.bracket_id =tgs.bracket_id and lbr.round = tgs.round  inner join user_breakets ubs on ubs.id=ubt.user_bracket_id where ubs.user_id = ${userId};`
    let AllBracketData = await req.database.query(sql, { type: req.database.QueryTypes.SELECT });
    let bracketData =AllBracketData.filter(ele=>ele.league_team_gender === bracketType)
    let otherbracketType = bracketType==="male"?"female":"male";
    let otherBracketData = AllBracketData.filter(ele=>ele.league_team_gender=== otherbracketType)
    if(otherBracketData && otherBracketData.length)isPartiallyFilledBracket[otherbracketType] = true;
    isPartiallyFilledBracket[bracketType]=true;

    let sqlTeam=`SELECT name,team_id FROM ncruat.tournament_teams;`
    let allteamArray = await req.database.query(sqlTeam, { type: req.database.QueryTypes.SELECT });
    let actual_team_1_name;
    let actual_team_2_name;
    let finalData = {};
    for (let row of bracketData) {
    
      if(row.winner_id)
      isPartiallyFilled = true
      // let league_id = row["league_id"];
      let { bracket_id, actual_winner_id, actual_team_1_id,actual_team_2_id,league_id, game_id, team_1_id, team_2_id, winner_id, round, position, t1_name, t1_thumbnails, t2_name, t2_thumbnails, division_teamid2, division_teamid1, team1_score, team2_score } = row;
      const allteamArrayResult=allteamArray.filter(ele=>ele.team_id===actual_team_1_id);
      
      actual_team_1_name=allteamArrayResult && allteamArrayResult.length ? allteamArrayResult[0].name : ''
      //console.log(allteamArrayResult[0].name)
      const allteamArrayResult2=allteamArray.filter(ele=>ele.team_id===actual_team_2_id)
      actual_team_2_name=allteamArrayResult2 && allteamArrayResult2.length ? allteamArrayResult2[0].name : ''
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
        division_teamid: division_teamid1
      }
      let team2 = {
        team_id: team_2_id,
        name: t2_name,
        thumbnails: t2_thumbnails,
        division_teamid: division_teamid2
      }
      finalData[league_id]["brackets"][bracket_id]["games"].push({ game_id,actual_team_1_id,actual_team_1_name,actual_team_2_name,actual_team_2_id, bracket_id, round, position, winner_id, actual_winner_id, team1, team2, winner_nextbracketid, winner_nextround, nextPostion, loser_nextbracketid, loserNextPosition, loser_nextround, winner_team_key, loser_team_key, team1_score, team2_score })
    }
    finalData = Object.values(finalData);
    for (let i in finalData) {
      finalData[i].user_bracket_id = userBracketId;
      let brackts = [];
      for (let j in finalData[i]['brackets']) {
        brackts.push(finalData[i]['brackets'][j])
      }
      finalData[i]['brackets'] = brackts;
    }
    //console.log(finalData);
    return res.status(req.constants.HTTP_SUCCESS).json({
      status: req.constants.SUCCESS,
      code: req.constants.HTTP_SUCCESS,
      data: {isPartiallyFilledBracket,isBracketEditable, bracketDetails: Object.values(finalData), userBracketId },
      message: "game list fetched succesfully"
    });
  } catch (err) {
    console.log(err);
    return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + err });
  }
};

const getLatestGames = async (req, res) => {
  try {
    let sql = `SELECT tgs.game_id,tgs.round,tgs.position,tls.gender,tls.name as league_name,tgs.team_1_id,tgs.team_2_id,tgs.winner_id,tm1.name as t1_name,tm1.team_id as team_1_id,tgs.team1_score,tm1.thumbnails as t1_thumbnails,tm2.name as t2_name,tm2.team_id as team_2_id,tgs.team2_score,tm2.thumbnails as t2_thumbnails FROM tournament_games tgs inner join tournament_breakets tbs on tgs.bracket_id=tbs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id left join tournament_teams tm1 on tm1.team_id=tgs.team_1_id left join tournament_teams tm2 on tm2.team_id=tgs.team_2_id where tgs.winner_id is not null and tgs.team1_score is not null and tgs.team2_score is not null order by tgs.updatedAt desc;`
    let bracketData = await req.database.query(sql, { type: req.database.QueryTypes.SELECT });
    let finalData = [];
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
    finalData.push({ league_name,game_id, round, position,gender,winner_id,  team1, team2})
    }
    finalData = Object.values(finalData);
    return res.status(req.constants.HTTP_SUCCESS).json({
      status: req.constants.SUCCESS,
      code: req.constants.HTTP_SUCCESS,
      message: "Scores fetched succesfully",
      data: {games:finalData},
    });
  } catch (err) {
    console.log(err);
    return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + err });
  }
};





module.exports = {
  getBracketDetails,
  getUserBracket,
  upsertBracketDetails,
  createUserBracket,
  tieBreakerResolver,
  getUserBracketDetails,
  getInCompleteBracketUsers,
  getLatestGames
}