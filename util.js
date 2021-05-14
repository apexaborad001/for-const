const getRoundWiseDetailsInFormat = async (roundWiseQueryResult,bracketId,gender) => {
    let genderWiseArray
    let scoreRoundFinalArray = [];
    let scoreRoundFinalObject = {};
    let lastRoundBracketName;
    let roundCounter = 0;
    let differentBracketFlag = false;
    if(gender=="female"){
           genderWiseArray =  {"Women_League": {1:{"score":0, "title":"1st ROUND"}, 2:{"score":0, "title":"QUARTERFINALS"}, 3:{"score":0, "title":"SEMI FINALS"}, 4:{"score":0, "title":"National Championship"},  5:{"score":0, "title":"3rd Place"}}, "Survivor_Cup":{1:{"score":0, "title":"QUARTERFINALS"}, 2:{"score":0, "title":"SEMI FINALS"}, 3:{"score":0, "title":"National Championship"},4:{"score":0, "title":"3rd Place"}}, "Champions_Cup":{1:{"score":0, "title":"SEMI FINALS"}, 2:{"score":0, "title":"National Championship"},3:{"score":0, "title":"3rd Place"}}, "Challenge_Cup":{ 1:{"score":0, "title":"SEMI FINALS"}, 2:{"score":0, "title":"National Championship"},3:{"score":0, "title":"3rd Place"}}};
    }
    else{
        genderWiseArray = {"Men_League": {1:{"score":0, "title":"1st ROUND"}, 2:{"score":0, "title":"2nd ROUND"}, 3:{"score":0, "title":"QUARTERFINALS"}, 4:{"score":0, "title":"SEMI FINALS"}, 5:{"score":0, "title":"National Championship"}, 6:{"score":0, "title":"3rd Place"}}, "Survivor_Cup":{1:{"score":0, "title":"2nd ROUND"}, 2:{"score":0, "title":"QUARTERFINALS"}, 3:{"score":0, "title":"SEMI FINALS"}, 4:{"score":0, "title":"National Championship"}, 5:{"score":0, "title":"3rd Place"}}, "Champions_Cup":{1:{"score":0, "title":"QUARTERFINALS"}, 2:{"score":0, "title":"SEMI FINALS"}, 3:{"score":0, "title":"National Championship"}, 4:{"score":0, "title":"3rd Place"}}, "Challenge_Cup":{ 1:{"score":0, "title":"QUARTERFINALS"}, 2:{"score":0, "title":"SEMI FINALS"}, 3:{"score":0, "title":"National Championship"},4:{"score":0, "title":"3rd Place"}}};
    }
    try{
	    for (let i = 0; i < roundWiseQueryResult.length; i++) {
		let ele = roundWiseQueryResult[i];
		
		let tem_le_name = ele.name.replace(" ","_");
		tem_le_name = tem_le_name.replace("'s","");
		genderWiseArray[tem_le_name][ele["round"]]["score"] = ele.score;
		if(genderWiseArray[tem_le_name][ele["round"]]["title"] == "National Championship"){
			if(genderWiseArray[tem_le_name][ele["round"]]["score"] == 360){
				genderWiseArray[tem_le_name][ele["round"]]["score"] = 240;
				let nround = (ele["round"]+1);
				genderWiseArray[tem_le_name][nround]["score"] = 120;
			}else if(genderWiseArray[tem_le_name][ele["round"]]["score"] == 120){
				genderWiseArray[tem_le_name][ele["round"]]["score"] = 0;
				let nround = (ele["round"]+1);
				genderWiseArray[tem_le_name][nround]["score"] = 120;
			}
		}
		
	    }
	 for(let key in genderWiseArray){
         	scoreRoundFinalObject[key] = Object.values(genderWiseArray[key])
         }
    }catch(err){
    	console.log(err);
    }
    return scoreRoundFinalObject;
};
const tieBreakerResolverFunction=async(req,userBracketId1,userBracketId2)=> {
    try {
        const sql = `SELECT ubs.user_id, abs((ubt.team_1_score+ubt.team_2_score) - (tgs.team1_score+tgs.team2_score)) as diff_score FROM leaderboards lbs inner join user_breakets ubs on ubs.user_id = lbs.userId and ubs.type= lbs.bracketType inner join user_breaket_teams ubt on ubs.id = ubt.user_bracket_id INNER JOIN tournament_games tgs on tgs.game_id=ubt.game_id where lbs.rank=1 and ubt.team1_score IS NOT NULL and ubt.team2_score IS NOT NULL order by diff_score limit 1`;
        const getQueryResult = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })
        return getQueryResult
    }
    catch (err) {
        console.log(err)
    }
  }

  async function insertUserBracketDetails(req, bracketType,userBracketId) {
    try{
         let sql = `select  tgs.game_id , tgs.team_1_id ,tgs.team_2_id,${userBracketId} as user_bracket_id
        from tournament_leagues tls inner join tournament_breakets tbs on tls.current_subseason_id = tbs.subseason_id inner join tournament_games tgs on 
          tgs.bracket_id = tbs.bracket_id left join tournament_teams tm1 on tm1.team_id=tgs.team_1_id left join tournament_teams tm2 on 
          tm2.team_id=tgs.team_2_id left join winner_brackt_relation wbr on wbr.bracket_id =tgs.bracket_id and wbr.round = tgs.round left join loser_brackt_relation lbr on lbr.bracket_id =tgs.bracket_id and lbr.round = tgs.round
           where tls.gender = "${bracketType}"`;
        const getQueryResult = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })
        await req.models.user_breaket_team.bulkCreate(getQueryResult);

        return getQueryResult
     }catch(err){
         console.log(err);
     }
 };

module.exports = {
    getRoundWiseDetailsInFormat,
    tieBreakerResolverFunction,
    insertUserBracketDetails
};
