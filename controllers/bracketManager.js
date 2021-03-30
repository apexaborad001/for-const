const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const helper = require('../helper/common-helper');
const logger = require('../helper/logger-helper');
const getGameLists = async(req, res) =>{  
        try{
           // const user_id = req.decoded.user_id;
            const gender = req.query.gender || "male";
            let sql = "select tls.league_id, tls.name as league_name, tls.gender as league_team_gender, tbs.bracket_id, tbs.bracket_position, tbs.devision, tbs.round_labels,tgs.game_id, tgs.team_1_id,tgs.team_2_id,";
            sql += "tgs.winner_id, tgs.round,tgs.position, tm1.name as t1_name, tm1.thumbnails as t1_thumbnails, tm2.name as t2_name, tm2.thumbnails as";
            sql += " t2_thumbnails, tm2.division_teamid as division_teamid2, tm1.division_teamid as division_teamid1 from tournament_leagues tls inner join tournament_breakets tbs on tls.current_subseason_id = tbs.subseason_id inner join tournament_games tgs on "; 
            sql += " tgs.bracket_id = tbs.bracket_id left join tournament_teams tm1 on tm1.team_id=tgs.team_1_id left join tournament_teams tm2 on ";
            sql += ` tm2.team_id=tgs.team_2_id where tls.gender = "${gender}"`;
            let bracketData = await req.database.query(sql, { type: req.database.QueryTypes.SELECT });
            let final_data={};
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
                final_data[league_id]["brackets"][bracket_id]["games"].push({game_id, round, position, winner_id, team1, team2 })
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

 
  
  
module.exports = {
    getGameLists
};
