const { required } = require('joi');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const helper = require('../helper/common-helper');
const logger = require('../helper/logger-helper');
const util =require('../util')
const {updateLeaderboardFunction}=require('./leaderboard')

const getGameLists = async(req, res) =>{  
        try{
            let currentScoreRound = 0;
            let currentScoreRoundFlag=true;
           // const user_id = req.decoded.user_id;
            const gender = req.query.gender || "male";
            const league_id = req.query.league_id  || "";
            let sql = "select tls.league_id, tls.name as league_name, tls.gender as league_team_gender, tbs.bracket_id, tbs.bracket_position, tbs.devision, tbs.round_labels,tgs.game_id, tgs.team_1_id,tgs.team_2_id,";
            sql += "tgs.winner_id, tgs.round,tgs.position, tm1.name as t1_name, tm1.thumbnails as t1_thumbnails, tm2.name as t2_name, tm2.thumbnails as";
            sql += " t2_thumbnails, tm2.division_teamid as division_teamid2, tm1.division_teamid as division_teamid1, lbr.position_relation as lbr_position_relation, wbr.position_relation,"
            sql += " wbr.nextbracketid as wbr_nextbracketid, wbr.nextround as wbr_nextround, lbr.nextbracketid as lbr_nextbracketid, lbr.nextround as lbr_nextround, tgs.team1_score, tgs.team2_score from tournament_leagues tls inner join tournament_breakets tbs on tls.current_subseason_id = tbs.subseason_id inner join tournament_games tgs on "; 
            sql += " tgs.bracket_id = tbs.bracket_id left join tournament_teams tm1 on tm1.team_id=tgs.team_1_id left join tournament_teams tm2 on ";
            sql += " tm2.team_id=tgs.team_2_id left join winner_brackt_relation wbr on wbr.bracket_id =tgs.bracket_id and wbr.round = tgs.round left join loser_brackt_relation lbr on lbr.bracket_id =tgs.bracket_id and lbr.round = tgs.round";
            sql += `  where tls.gender = "${gender}"`;
            if(league_id){
                sql += `  and tls.league_id = "${league_id}"`;
            }
            let bracketData = await req.database.query(sql, { type: req.database.QueryTypes.SELECT });
            let final_data={};
            for(let row of bracketData){ 
                
               // let league_id = row["league_id"];
                let {bracket_id, league_id, game_id,team_1_id,team_2_id,winner_id,round, position, t1_name, t1_thumbnails,t2_name,t2_thumbnails, division_teamid2, division_teamid1, team1_score, team2_score } = row;
                if(currentScoreRoundFlag && !(row.team2_score || row.team1_score)){
                    currentScoreRound=row.round ;
                    currentScoreRoundFlag=false;
                    if(final_data[league_id])final_data[league_id]['current_score_round'] =currentScoreRound;
                    
                }
                if(!final_data[league_id]) {
                    currentScoreRoundFlag = true;
                    currentScoreRound =0;
                    final_data[league_id] = {};
                    // final_data['current_score_round']=currentScoreRound
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
 
const getUserGameLists = async(req, res) =>{
        try{
           const userId = req.decoded.user_id;
            const gender = req.query.gender || "male";
            let sql = "select tls.league_id,ubt.winner_id as user_winner_id,ubt.user_bracket_id, tls.name as league_name, tls.gender as league_team_gender, tbs.bracket_id, tbs.bracket_position, tbs.devision, tbs.round_labels,tgs.game_id, tgs.team_1_id,tgs.team_2_id,";
            sql += "tgs.winner_id, tgs.round,tgs.position, tm1.name as t1_name, tm1.thumbnails as t1_thumbnails, tm2.name as t2_name, tm2.thumbnails as";
            sql += " t2_thumbnails, tm2.division_teamid as division_teamid2, tm1.division_teamid as division_teamid1 from tournament_leagues tls inner join tournament_breakets tbs on tls.current_subseason_id = tbs.subseason_id inner join tournament_games tgs on ";
            sql += " tgs.bracket_id = tbs.bracket_id left join tournament_teams tm1 on tm1.team_id=tgs.team_1_id left join tournament_teams tm2 on ";
            sql += ` tm2.team_id=tgs.team_2_id left join user_breaket_teams ubt on tgs.game_id = ubt.game_id left JOIN user_breakets on ubt.user_bracket_id= user_breakets.id where user_breakets.user_id="${userId}" and tls.gender = "${gender}"`;
            let bracketData = await req.database.query(sql, { type: req.database.QueryTypes.SELECT });
            let final_data={};
            for(let row of bracketData){
               // let league_id = row["league_id"];
                let {bracket_id, league_id, game_id,team_1_id,team_2_id,user_winner_id,winner_id,round, position, t1_name, t1_thumbnails,t2_name,t2_thumbnails, division_teamid2, division_teamid1} = row;
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
                final_data[league_id]["brackets"][bracket_id]["games"].push({game_id, round, position, winner_id, user_winner_id,team1, team2 })
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
                message: "get game list"
            });
        }catch(err){
            console.log(err);
           return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + err });
        }
    };
 
 
const updateWinner = async (req, res)=>{
    try{
        let game_id = req.query.game_id || 0;
        let winner_id = req.query.winner_id || 0;
        
        let sql = "select tgms.*, wbr.nextbracketid as wbr_nextbracketid, wbr.nextround as wbr_nextround, wbr.position_relation, wbr.point as wbr_point, lbr.nextbracketid as";
        sql +=  " lbr_nextbracketid, lbr.nextround as lbr_nextround, lbr.point as lbr_point, lbr.position_relation as lbr_position_relation from tournament_games tgms left join winner_brackt_relation wbr";
        sql +=  " on wbr.bracket_id =tgms.bracket_id and wbr.round = tgms.round left join loser_brackt_relation lbr on lbr.bracket_id =tgms.bracket_id and";
        sql +=  ` lbr.round = tgms.round  where game_id=${game_id}`;
        let bracketData = await req.database.query(sql, { type: req.database.QueryTypes.SELECT });
        bracketData = bracketData[0];
        let loser_id = 0;
        if(bracketData && bracketData["team_1_id"] == winner_id){
            loser_id = bracketData["team_2_id"] ;
        }else if(bracketData && bracketData["team_2_id"] == winner_id){
            loser_id = bracketData["team_1_id"] ;
        }else{
            return res.status(req.constants.HTTP_NOT_EXISTS).json({
                status: req.constants.ERROR,
                code: req.constants.HTTP_NOT_EXISTS,
                message: "Invalid winner details"
              })
        }
        let nextPostion = 0 ;
        let is_odd = true;
        if(bracketData["position"]%2 == 0) is_odd = false;
        let wbr_nextbracketid = bracketData["wbr_nextbracketid"];
        let wbr_nextround = bracketData["wbr_nextround"];
        let lbr_nextbracketid = bracketData["lbr_nextbracketid"];
        let lbr_nextround = bracketData["lbr_nextround"];
        if(bracketData["position_relation"]){
            let found = bracketData["position_relation"].split(",").find(element => element.split(":")[0]==bracketData["position"]);
            //console.log("found",found)

            if(found){
                let splitData = found.split(":");
                nextPostion = splitData[1];
                if(splitData[2]) bracketData["wbr_point"] = splitData[2];
            }
        }
        
        if(!nextPostion && !is_odd){
                nextPostion = bracketData["position"]/2;    
        }else if(!nextPostion) {
                nextPostion = (bracketData["position"]+1)/2; 
        }
        
        const t = await req.database.transaction();
         try {
            let temaUpdate = {};
            let temaUpdate2 = {};
            if(is_odd){
                temaUpdate = {team_1_id:winner_id};
                temaUpdate2 = {team_1_id:loser_id};
            }else{
                temaUpdate = {team_2_id:winner_id};
                temaUpdate2 = {team_2_id:loser_id};
            }
            if(wbr_nextbracketid){
                const team1Updated = await req.models.tournament_game.update(temaUpdate,{
                    where: { 
                        bracket_id : wbr_nextbracketid, 
                        position:nextPostion,
                        round:wbr_nextround
                }
                }, { transaction: t });
            }
            if(lbr_nextbracketid){
                if(bracketData["lbr_position_relation"]){
                    let found = bracketData["lbr_position_relation"].split(",").find(element => element.split(":")[0]==bracketData["position"]);
                    if(found){
                        nextPostion = found.split(":")[1];
                    }
                }
                const team2Updated = await req.models.tournament_game.update(temaUpdate2,{
                    where: { 
                        bracket_id : lbr_nextbracketid, 
                        position:nextPostion,
                        round:lbr_nextround
                  }
                }, { transaction: t })
            }
            await req.models.tournament_game.update({winner_id:winner_id, looser_id:loser_id, winner_score:bracketData["wbr_point"]},{
                where: { 
                   id:bracketData["id"]
              }
            }, { transaction: t })

            await t.commit();
            return res.status(req.constants.HTTP_SUCCESS).json({ 
                status: req.constants.SUCCESS, 
                code: req.constants.HTTP_SUCCESS,
                message: "Winner updated successfully"
            });
          } catch (error) { 
            await t.rollback();
            return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + error });

          }
 
    }catch(err){
       return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + err });
    }
}

const updateMultiWinner = async (req, res)=>{
    try{
        let gameDATAArr = req.body.game_data;
        console.log(gameDATAArr[0]);
        let dataByGameID = [];    
        let gameIDs = [];    
        for(let grow of gameDATAArr){
           if(grow["game_id"]) {
               dataByGameID[grow["game_id"]] =  grow["team_id"];
               gameIDs.push(grow["game_id"]);
           }
        }
        if(gameIDs.length == 0){
            return res.status(req.constants.HTTP_NOT_EXISTS).json({
                status: req.constants.ERROR,
                code: req.constants.HTTP_NOT_EXISTS,
                message: "Invalid req params"
            })
        }
        gameIDs = gameIDs.join(",");
        let updateError = [];
        let sql = "select tgms.*, wbr.nextbracketid as wbr_nextbracketid, wbr.nextround as wbr_nextround, wbr.position_relation, wbr.point as wbr_point, lbr.nextbracketid as";
        sql +=  " lbr_nextbracketid, lbr.nextround as lbr_nextround, lbr.point as lbr_point, lbr.position_relation as lbr_position_relation from tournament_games tgms left join winner_brackt_relation wbr";
        sql +=  " on wbr.bracket_id =tgms.bracket_id and wbr.round = tgms.round left join loser_brackt_relation lbr on lbr.bracket_id =tgms.bracket_id and";
        sql +=  ` lbr.round = tgms.round  where game_id in (${gameIDs})`;
        let bracketDataByGID = await req.database.query(sql, { type: req.database.QueryTypes.SELECT });
        for(let i in bracketDataByGID){
            bracketData = bracketDataByGID[i];
            let winner_id = dataByGameID[bracketData["game_id"]];
            let loser_id = 0;
            if(bracketData && bracketData["team_1_id"] == winner_id){
                loser_id = bracketData["team_2_id"] ;
            }else if(bracketData && bracketData["team_2_id"] == winner_id){
                loser_id = bracketData["team_1_id"] ;
            }else{
               updateError.push({error:"Invalid winner details","game_id":bracketData["game_id"], winner_id });
               continue;
            }
            let nextPostion = 0 ;
            let is_odd = true;
            if(bracketData["position"]%2 == 0) is_odd = false;
            let wbr_nextbracketid = bracketData["wbr_nextbracketid"];
            let wbr_nextround = bracketData["wbr_nextround"];
            let lbr_nextbracketid = bracketData["lbr_nextbracketid"];
            let lbr_nextround = bracketData["lbr_nextround"];
            if(bracketData["position_relation"]){
                let found = bracketData["position_relation"].split(",").find(element => element.split(":")[0]==bracketData["position"]);
                if(found){
                    let splitData = found.split(":");
                    nextPostion = splitData[1];
                    if(splitData[2]) bracketData["wbr_point"] = splitData[2];
                }
            }
            
            if(!nextPostion && !is_odd){
                    nextPostion = bracketData["position"]/2;    
            }else if(!nextPostion) {
                    nextPostion = (bracketData["position"]+1)/2; 
            }
            
            const t = await req.database.transaction();
            try {
                let temaUpdate = {};
                let temaUpdate2 = {};
                if(is_odd){
                    temaUpdate = {team_1_id:winner_id};
                    temaUpdate2 = {team_1_id:loser_id};
                }else{
                    temaUpdate = {team_2_id:winner_id};
                    temaUpdate2 = {team_2_id:loser_id};
                }
                if(wbr_nextbracketid){
                    const team1Updated = await req.models.tournament_game.update(temaUpdate,{
                        where: { 
                            bracket_id : wbr_nextbracketid, 
                            position:nextPostion,
                            round:wbr_nextround
                    }
                    }, { transaction: t });
                }
                if(lbr_nextbracketid){
                    if(bracketData["lbr_position_relation"]){
                        let found = bracketData["lbr_position_relation"].split(",").find(element => element.split(":")[0]==bracketData["position"]);
                        if(found){
                            nextPostion = found.split(":")[1];
                        }
                    }
                    const team2Updated = await req.models.tournament_game.update(temaUpdate2,{
                        where: { 
                            bracket_id : lbr_nextbracketid, 
                            position:nextPostion,
                            round:lbr_nextround
                    }
                    }, { transaction: t })
                }
                await req.models.tournament_game.update({winner_id:winner_id, looser_id:loser_id, winner_score:bracketData["wbr_point"]},{
                    where: { 
                    id:bracketData["id"]
                }
                }, { transaction: t })

                await t.commit();
                

            } catch (error) { 
                    await t.rollback();
                    return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + error });

            }
          }
          return res.status(req.constants.HTTP_SUCCESS).json({ 
            status: req.constants.SUCCESS, 
            code: req.constants.HTTP_SUCCESS,
            message: "Winner updated successfully",
            updateError:updateError
            });
 
    }catch(err){
       return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + err });
    }
}


const cupWiseDetails =  async(req, res) => {
        
        const roundWiseScoreObject ={};
        const survivorCupScore= await util.cupWiseScoreDetails(req,"looser_id",1,"Survivor Cup")
        roundWiseScoreObject['survivorCupScore']=survivorCupScore
        const championsCupScore= await util.cupWiseScoreDetails(req,"looser_id",2,"Champions Cup")
        roundWiseScoreObject['championsCupScore']=championsCupScore
        const challengeCupScore= await util.cupWiseScoreDetails(req,"looser_id",1,"Challenge Cup")
        roundWiseScoreObject['challengeCupScore']=challengeCupScore
        console.log(roundWiseScoreObject)
  };
  
  const getGameListsByUserBracketID = async(req, res) =>{  
    try{
       // const user_id = req.decoded.user_id;
        const gender = req.query.gender || "male";
        const league_id = req.query.league_id  || "";
        const user_bracket_id = req.query.user_bracket_id  || "";
        let mainBracketId = [1,2,3,4,5,15,16,17,18,19];
        let championBractID = [12,13,14,26,27,28];
        let sql = "select tls.league_id, tls.name as league_name, tls.gender as league_team_gender, tbs.bracket_id, tbs.bracket_position, tbs.devision, tbs.round_labels,tgs.game_id, tgs.team_1_id,tgs.team_2_id,";
        sql += "tgs.winner_id, tgs.round,tgs.position, tm1.name as t1_name, tm1.thumbnails as t1_thumbnails, tm2.name as t2_name, tm2.thumbnails as";
        sql += " t2_thumbnails, tm2.division_teamid as division_teamid2, tm1.division_teamid as division_teamid1, lbr.position_relation as lbr_position_relation, wbr.position_relation,"
        sql += " wbr.nextbracketid as wbr_nextbracketid, wbr.nextround as wbr_nextround, lbr.nextbracketid as lbr_nextbracketid, lbr.nextround as lbr_nextround from tournament_leagues tls inner join tournament_breakets tbs on tls.current_subseason_id = tbs.subseason_id inner join tournament_games tgs on "; 
        sql += " tgs.bracket_id = tbs.bracket_id left join tournament_teams tm1 on tm1.team_id=tgs.team_1_id left join tournament_teams tm2 on ";
        sql += " tm2.team_id=tgs.team_2_id left join winner_brackt_relation wbr on wbr.bracket_id =tgs.bracket_id and wbr.round = tgs.round left join loser_brackt_relation lbr on lbr.bracket_id =tgs.bracket_id and lbr.round = tgs.round";
        sql += `  where tls.gender = "${gender}"`;
        if(league_id){
            sql += `  and tls.league_id = "${league_id}"`;
        }
        
        let bracketData = await req.database.query(sql, { type: req.database.QueryTypes.SELECT });
        let sql2 = "select tournament_games.game_id, team_id, round, bracket_id from user_breaket_teams inner join tournament_games on tournament_games.game_id= user_breaket_teams.game_id where user_bracket_id="+user_bracket_id;
        let userData = await req.database.query(sql2, { type: req.database.QueryTypes.SELECT });
        let round1TeamID = [];
        let round2TeamID = [];
        let gameWiseTeamID = {};
        for(let row of userData){
                if(row["round"] == 1){
                    round1TeamID.push(row["team_id"]);
                }else if(row["round"] == 2){
                    round2TeamID.push(row["team_id"]);
                }

                gameWiseTeamID[row["game_id"]] = row["team_id"];
            
        }
        let final_data={};
        let nextTeamReLation = {};
        for(let row of bracketData){ 
           // let league_id = row["league_id"];
            let {bracket_id, league_id, game_id,team_1_id,team_2_id,winner_id,round, position, t1_name, t1_thumbnails,t2_name,t2_thumbnails, division_teamid2, division_teamid1} = row;
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

            let user_teams = [];
            let user_winner_id = 0;
            if(mainBracketId.includes(bracket_id)){
                if(gameWiseTeamID[game_id]){
                        if(!nextTeamReLation[winner_nextbracketid]) nextTeamReLation[winner_nextbracketid] = {};
                        if(!nextTeamReLation[winner_nextbracketid][winner_nextround]) nextTeamReLation[winner_nextbracketid][winner_nextround] = {};
                        if(!nextTeamReLation[winner_nextbracketid][winner_nextround][nextPostion]) nextTeamReLation[winner_nextbracketid][winner_nextround][nextPostion] = {};
                        if(gameWiseTeamID[game_id] == team_1_id){
                            console.log(gameWiseTeamID[game_id]);
                            nextTeamReLation[winner_nextbracketid][winner_nextround][nextPostion][winner_team_key] =  team1;
                        }else{
                            nextTeamReLation[winner_nextbracketid][winner_nextround][nextPostion][winner_team_key] =  team2;
                        }                        
                } 
                
                if(nextTeamReLation[bracket_id] && nextTeamReLation[bracket_id][round] && nextTeamReLation[bracket_id][round][position]){
                    user_teams    =  nextTeamReLation[bracket_id][round][position]; 
                }
                user_winner_id = gameWiseTeamID[game_id];
            }else if(championBractID.includes(bracket_id)){
                user_winner_id = round2TeamID.find((elm)=>(elm == team_1_id || elm == team_2_id));
            }else {
                user_winner_id = round1TeamID.find((elm)=>(elm == team_1_id || elm == team_2_id));
            }
            final_data[league_id]["brackets"][bracket_id]["games"].push({game_id, bracket_id, round, position, winner_id, team1, team2, winner_nextbracketid, winner_nextround, nextPostion, loser_nextbracketid, loserNextPosition, loser_nextround, winner_team_key, loser_team_key, user_teams, user_winner_id })
          
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
const updateMultiWinnerByScore = async (req, res)=>{
    try{
        // if(!req.decoded.admin){
        //     return res.status(req.constants.HTTP_FORBIDDEN).json({ status: req.constants.ERROR, code: req.constants.HTTP_FORBIDDEN, message: "You are not allowed to update the score." });
        // }
        
        const bracketType = req.body.bracket_type;   
        let gameDATAArr = JSON.parse(req.body.game_data);
        //console.log(gameDATAArr[0]);
        let dataByGameID = [];    
        let gameIDs = [];    
        for(let grow of gameDATAArr){
           if(grow["game_id"]) {
               dataByGameID[grow["game_id"]] =  {"team1_score":grow["team1_score"], "team2_score":grow["team2_score"]}
               gameIDs.push(grow["game_id"]);
           }
        }
        if(gameIDs.length == 0){
            return res.status(req.constants.HTTP_NOT_EXISTS).json({
                status: req.constants.ERROR,
                code: req.constants.HTTP_NOT_EXISTS,
                message: "Invalid req params"
            })
        }
        gameIDs = gameIDs.join(",");
        let updateError = [];
        let sql = "select tgms.*, wbr.nextbracketid as wbr_nextbracketid, wbr.nextround as wbr_nextround, wbr.position_relation, wbr.point as wbr_point, lbr.nextbracketid as";
        sql +=  " lbr_nextbracketid, lbr.nextround as lbr_nextround, lbr.point as lbr_point, lbr.position_relation as lbr_position_relation from tournament_games tgms left join winner_brackt_relation wbr";
        sql +=  " on wbr.bracket_id =tgms.bracket_id and wbr.round = tgms.round left join loser_brackt_relation lbr on lbr.bracket_id =tgms.bracket_id and";
        sql +=  ` lbr.round = tgms.round  where game_id in (${gameIDs})`;
        let bracketDataByGID = await req.database.query(sql, { type: req.database.QueryTypes.SELECT });
        for(let i in bracketDataByGID){
            bracketData = bracketDataByGID[i];
            let loser_id = 0;
            let winner_id = 0;
            if(dataByGameID[bracketData["game_id"]]["team1_score"] == bracketData['team1_score'] && dataByGameID[bracketData["game_id"]]["team2_score"] == bracketData['team2_score']){
            	continue;
            }
            if(dataByGameID[bracketData["game_id"]]["team1_score"] || dataByGameID[bracketData["game_id"]]["team2_score"]){
                if(dataByGameID[bracketData["game_id"]]["team1_score"]-dataByGameID[bracketData["game_id"]]["team2_score"] > 0){
                    winner_id = bracketData["team_1_id"];
                    loser_id = bracketData["team_2_id"] ;
                }else{
                    winner_id = bracketData["team_2_id"];
                    loser_id = bracketData["team_1_id"] ;
                }
                
                let nextPostion = 0 ;
                let is_odd = true;
                if(bracketData["position"]%2 == 0) is_odd = false;
                let wbr_nextbracketid = bracketData["wbr_nextbracketid"];
                let wbr_nextround = bracketData["wbr_nextround"];
                let lbr_nextbracketid = bracketData["lbr_nextbracketid"];
                let lbr_nextround = bracketData["lbr_nextround"];
                if(bracketData["position_relation"]){
                    let found = bracketData["position_relation"].split(",").find(element => element.split(":")[0]==bracketData["position"]);
                    if(found){
                        let splitData = found.split(":");
                        nextPostion = splitData[1];
                        if(splitData[2]) bracketData["wbr_point"] = splitData[2];
                    }
                }
                
                if(!nextPostion && !is_odd){
                        nextPostion = bracketData["position"]/2;    
                }else if(!nextPostion) {
                        nextPostion = (bracketData["position"]+1)/2; 
                }
                
                const t = await req.database.transaction();
                try {
                    let temaUpdate = {};
                    let temaUpdate2 = {};
                    if(is_odd){
                        temaUpdate = {team_1_id:winner_id};
                        temaUpdate2 = {team_1_id:loser_id};
                    }else{
                        temaUpdate = {team_2_id:winner_id};
                        temaUpdate2 = {team_2_id:loser_id};
                    }
                    if(wbr_nextbracketid){
                        const team1Updated = await req.models.tournament_game.update(temaUpdate,{
                            where: { 
                                bracket_id : wbr_nextbracketid, 
                                position:nextPostion,
                                round:wbr_nextround
                        }
                        }, { transaction: t });
                    }
                    if(lbr_nextbracketid){
                        if(bracketData["lbr_position_relation"]){
                            let found = bracketData["lbr_position_relation"].split(",").find(element => element.split(":")[0]==bracketData["position"]);
                            if(found){
                                nextPostion = found.split(":")[1];
                            }
                        }
                        const team2Updated = await req.models.tournament_game.update(temaUpdate2,{
                            where: { 
                                bracket_id : lbr_nextbracketid, 
                                position:nextPostion,
                                round:lbr_nextround
                        }
                        }, { transaction: t })
                    }
                    await req.models.tournament_game.update({winner_id:winner_id, looser_id:loser_id, winner_score:bracketData["wbr_point"], team1_score:dataByGameID[bracketData["game_id"]]["team1_score"], team2_score:dataByGameID[bracketData["game_id"]]["team2_score"]},{
                        where: { 
                        id:bracketData["id"]
                    }
                    }, { transaction: t })

                    await t.commit();
                    

                } catch (error) { 
                        await t.rollback();
                        return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + error });

                }
                if(bracketType)
                await updateLeaderboardFunction(req,bracketType)
            }
          }
          return res.status(req.constants.HTTP_SUCCESS).json({ 
            status: req.constants.SUCCESS, 
            code: req.constants.HTTP_SUCCESS,
            message: "Winner updated successfully",
            updateError:updateError
            });
 
    }catch(err){
       return res.status(req.constants.HTTP_SERVER_ERROR).json({ status: req.constants.ERROR, message: "Internal Server error- Cannot save user" + err });
    }
}

module.exports = {
    getGameLists,
    updateWinner,
    getUserGameLists,
    cupWiseDetails,
    updateMultiWinner,
    getGameListsByUserBracketID,
    updateMultiWinnerByScore
};
